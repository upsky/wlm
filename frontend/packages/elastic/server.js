let elasticsearch = Npm.require('elasticsearch');
let Future = Npm.require('fibers/future');

/**
 * Elasticsearch node
 */
class Node {
	/**
	 * Constructor
	 * @param host {string} e. g. 'localhost:9200'
	 */
	constructor (host) {
		check(host, String);
		/**
		 * Elasticsearch instance
		 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
		 * @type {Object}
		 */
		this.client = new elasticsearch.Client({ host });
	}

	/**
	 * Return documents matching a query
	 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search
	 * @returns {*}
	 */
	search (...args) {
		return this.client.search(...args);
	}

	/**
	 * @callback Node#syncUpdatedCallback
	 * @params [date] {Date}
	 * @returns {?Date}
	 */

	/**
	 * Start synchronisation
	 * @param collection {Mongo.Collection}
	 * @param target {string} elasticsearch index and type, e. g. "shop/items"
	 * @param [options] {Object}
	 * @param [options.timeout = 500] {number}
	 * @param [options.fields] {Object}
	 * @param [options.fields.id = '_id'] {string}
	 * @param [options.fields.created] {string}
	 * @param [options.fields.updated] {string}
	 * @param [options.fields.removed] {string}
	 * @param [options.serialize] {Array.<string>}
	 * @param [options.updated] {Node#syncUpdatedCallback}
	 */
	sync (collection, target, options) {
		check(collection, Mongo.Collection);
		check(target, String);
		options = options || {};
		options.fields = options.fields || {};
		options.fields.id = options.fields.id || '_id';
		options.updated = options.updated || function () { return null };

		let match = target.split('/');
		if (match.length !== 2)
			throw new Error('Target should be passed as "index/type"');
		let _index = match[0];
		let _type = match[1];
		let cursor = collection.find();

		/** @type {?{ added: Map, updated: Map, removed: Set }} */
		let pending;
		let timeout;

		let sync = () => {
			if (timeout)
				return;
			timeout = true;
			Meteor.setTimeout(() => {
				let body = [];
				pending.added.forEach((doc, _id) => {
					body.push({ index: { _index, _type, _id } }, doc);
				});
				pending.updated.forEach((doc, _id) => {
					body.push({ update: { _index, _type, _id } }, { doc });
				});
				pending.removed.forEach((_id) => {
					body.push({ delete: { _index, _type, _id } });
				});
				this.client.bulk({ body });
				sync.reset();
				options.updated(sync.updated = new Date());
			}, options.timeout || 500);
		};

		sync.updated = options.updated();

		sync.reset = function () {
			pending = { added: new Map(), updated: new Map(), removed: new Set() };
			timeout = false;
		};

		sync.add = function (doc) {
			let _id = id(doc);
			pending.added.set(_id, serialize(doc));
			pending.updated.delete(_id);
			pending.removed.delete(_id);
			sync();
		};

		sync.update = function (doc) {
			let _id = id(doc);
			pending.updated.set(_id, serialize(doc));
			pending.added.delete(_id);
			pending.removed.delete(_id);
			sync();
		};

		sync.remove = function (doc) {
			let _id = id(doc);
			pending.removed.add(_id);
			pending.added.delete(_id);
			pending.updated.delete(_id);
			sync();
		};

		sync.reset();

		cursor.observe({
			added (doc) {
				if (removed(doc))
					return void collection.remove(id(doc, true));
				let _created = created(doc);
				if (!_created /* TODO save it to doc? */ || !sync.updated || _created > sync.updated)
					return void sync.add(doc);
				let _updated = updated(doc);
				if (_updated && sync.updated && _updated > sync.updated)
					sync.update(doc);
			},
			changed (after, before) {
				if (removed(after))
					return void collection.remove(id(after, true));
				if (id(after) !== id(before)) {
					sync.remove(before);
					sync.add(after);
				} else {
					sync.update(after);
				}
			},
			removed: sync.remove
		});

		function id (doc, asis) {
			// `as is` param is used for getting ObjectId instead of string
			return asis ? doc[options.fields.id] : doc[options.fields.id] + '';
		}

		function created (doc) {
			return options.fields.created && doc[options.fields.created];
		}

		function updated (doc) {
			return options.fields.updated && doc[options.fields.updated];
		}

		function removed (doc) {
			return options.fields.removed && !!doc[options.fields.removed];
		}

		function serialize (doc) {
			let result;
			if (!options.serialize) {
				result = doc;
			} else {
				result = {};
				for (let key of options.serialize) {
					result[key] = doc[key];
				}
			}
			return without(result, Object.keys(options.fields).map(key => options.fields[key]));
		}
	}
}

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

function without (object, keys) {
	keys = Array.isArray(keys) ? keys : [keys];
	let result = {};
	for (let key of Object.keys(object))
		if (keys.indexOf(key) === -1)
			result[key] = object[key];
	return result;
}

Elastic = { Node, Search };
