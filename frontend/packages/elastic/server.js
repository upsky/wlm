const assign = Object.assign || Npm.require('object-assign');
const elasticsearch = Npm.require('elasticsearch');
const Future = Npm.require('fibers/future');

class Search {
	constructor (type) {
		check(type, String);
		let self = this;
		Meteor.methods({
			[`search/${type}`] (query) {
				let future = new Future();
				self._handler(query, function (error, result) {
					if (error)
						return void future.return(error);
					//noinspection JSUnresolvedVariable
					future.return(result.hits.hits.map((hit) => {
						let object = hit._source;
						object._id = hit._id;
						return object;
					}));
				});
				return future.wait();
			}
		});
	}

	onPerform (handler) {
		this._handler = handler;
	}

	//noinspection JSMethodCanBeStatic
	_handler () {
		arguments[1]([]);
	}
}

class Source {
	constructor (collection, options) {
		check(collection, Mongo.Collection);
		this.collection = collection;
		let fields = options && options.fields || {};
		this.fields = {
			id: fields.id || '_id',
			created: fields.created || '_created',
			updated: fields.updated || '_updated'
		};
	}

	get name () {
		return this.collection._name;
	}

	id (doc, value) {
		return Source.value(this.fields.id, doc, value);
	}

	created (doc, value) {
		return Source.value(this.fields.created, doc, value);
	}

	updated (doc, value) {
		return Source.value(this.fields.updated, doc, value);
	}

	serialize (doc) {
		return without(doc, Object.keys(this.fields).map(key => this.fields[key]));
	}

	static from (arg) {
		if (arg instanceof Source)
			return arg;
		if (arg instanceof Mongo.Collection)
			return new Source(arg);
		throw new TypeError('Not a source');
	}

	static value (field, doc, value) {
		if (typeof value === 'undefined')
			return doc[field];
		else
			doc[field] = value;
	}
}

class Logger {
	constructor (collection) {
		if (typeof collection === 'string' || typeof collection === 'undefined') {
			this.collection = new Mongo.Collection(collection || 'logs');
		} else if (collection instanceof Mongo.Collection) {
			this.collection = collection;
		} else {
			throw new TypeError('Collection should be a Mongo.Collection instance or a collection name');
		}
	}

	watch (subject) {
		if (Array.isArray(subject))
			return void subject.forEach(this.watch, this);
		subject = Source.from(subject);

		let c = subject.collection;
		c.before.insert((userId, doc) => {
			subject.created(doc, new Date());
		});
		c.before.update((userId, doc, fieldNames, modifier, options) => {
			modifier.$set = modifier.$set || {};
			subject.updated(modifier.$set, new Date());
		});
		c.after.remove((userId, doc) => {
			this.collection.insert({ c: subject.name, r: subject.id(doc) });
		});
	}
}

class Node {
	constructor (host) {
		check(host, String);
		this.client = new elasticsearch.Client({ host });
	}

	search (...args) {
		return this.client.search(...args);
	}
}

class Sync {
	constructor (node, index, state, logs, timeout) {
		timeout = timeout || 500;
		check(node, Node);
		check(index, String);
		check(state, Match.OneOf(Mongo.Collection, Function));
		check(logs, Match.OneOf(Mongo.Collection, Logger));
		check(timeout, Number);
		assign(this, {
			node,
			index,
			state,
			logs: logs instanceof Logger ? logs.collection : logs,
			timeout
		});
	}

	add (source, fields) {
		source = Source.from(source);
		check(fields, Match.OneOf([String], Function, void 0));

		let sync = () => {
			if (sync.timeout)
				return;
			sync.timeout = true;
			Meteor.setTimeout(() => {
				let body = [];
				sync.pending.added.forEach((doc, _id) => {
					body.push({ index: { _index: this.index, _type: source.name, _id } }, doc);
				});
				sync.pending.updated.forEach((doc, _id) => {
					body.push({ update: { _index: this.index, _type: source.name, _id } }, { doc });
				});
				sync.pending.removed.forEach((_id) => {
					body.push({ delete: { _index: this.index, _type: source.name, _id } });
				});
				this.node.client.bulk({ body });
				sync.reset();
				this.updated(source.name, sync.updated = new Date());
			}, this.timeout);
		};

		/** @type {?{ added: Map, updated: Map, removed: Set }} */
		sync.pending = null;
		sync.timeout = false;
		sync.updated = this.updated(source.name);

		sync.reset = () => {
			sync.pending = { added: new Map(), updated: new Map(), removed: new Set() };
			sync.timeout = false;
		};

		sync.add = (doc) => {
			let _id = source.id(doc) + '';
			sync.pending.added.set(_id, serialize(doc));
			sync.pending.updated.delete(_id);
			sync.pending.removed.delete(_id);
			sync();
		};

		sync.update = (doc) => {
			let _id = source.id(doc) + '';
			sync.pending.updated.set(_id, serialize(doc));
			sync.pending.added.delete(_id);
			sync.pending.removed.delete(_id);
			sync();
		};

		sync.remove = function (id) {
			sync.pending.removed.add(id);
			sync.pending.added.delete(id);
			sync.pending.updated.delete(id);
			sync();
		};

		sync.reset();

		source.collection.find.apply(source.collection, sync.updated ? [{
			$or: [
				{ [source.fields.created]: { $gt: sync.updated } },
				{ [source.fields.updated]: { $gt: sync.updated } }
			]
		}] : []).observe({
			added (doc) {
				let _created = source.created(doc);
				if (!_created /* TODO save it to doc? */ || _created > sync.updated || !sync.updated)
					return void sync.add(doc);
				let _updated = source.updated(doc);
				if (_updated && sync.updated && _updated > sync.updated)
					sync.update(doc);
			},
			changed (after, before) {
				if (source.id(after) !== source.id(before)) {
					sync.remove(source.id(before) + '');
					sync.add(after);
				} else {
					sync.update(after);
				}
			}
		});

		this.logs.find({ c: source.name }).observe({
			added: (doc) => {
				this.logs.remove(doc._id);
				sync.remove(doc.r + '');
			}
		});

		function serialize (doc) {
			let result;
			if (!fields)
				result = doc;
			else if (typeof fields === 'function')
				result = fields(doc);
			else if (Array.isArray(fields)) {
				result = {};
				for (let key of fields)
					result[key] = doc[key];
			}
			return source.serialize(result);
		}
	}

	/** @api private */
	updated (name, date) {
		check(name, String);
		check(date, Match.OneOf(Date, void 0));
		if (typeof date === 'undefined') {
			if (this.state instanceof Mongo.Collection) {
				let found = this.state.findOne(name);
				return found ? found.value : null;
			} else if (typeof this.state === 'function')
				return this.state(name);
		} else {
			if (this.state instanceof Mongo.Collection)
				this.state.upsert(name, { $set: { value: date } });
			else if (typeof this.state === 'function')
				this.state(name, date);
		}
	}
}

function without (object, keys) {
	keys = Array.isArray(keys) ? keys : [keys];
	let result = {};
	for (let key of Object.keys(object))
		if (keys.indexOf(key) === -1)
			result[key] = object[key];
	return result;
}

Elastic = { Logger, Node, Search, Source, Sync };
