
CatalogConstructor = (function() {
	function catalog(config) {
		check(config, Match.OneOf(String, Match.ObjectIncluding({ catalogName: String })));
		config = config || {};

		this._data = {};

		var self = this;
		var ready = new ReactiveVar(false);
		var categories = {};
		var collName = 'catalog';
		var coll = CatalogCollection;
		var catName = _.isString(config) ? config : config.catalogName;

		var sub = Meteor.subscribe(collName, function() {
			var doc = coll.find({ title: catName }, { limit: 1 });
			var data = doc.fetch();

			if (data.length) {
				sub.stop();
				sub = Meteor.subscribe(collName, data[0]._id, function() {
					ready.set(true);
				});
				Meteor.autorun(function() {
					var data = doc.fetch();

					if (data.length) {
						self.data(data[0]);
					}
				});
			} else {
				coll.insert({ title: catName, type: 'catalog' }, function(error, result) {
					if (error) {
						self.logError(error);
					} else {
						sub.stop();
						sub = Meteor.subscribe(collName, result, function() {
							ready.set(true);
						});
						Meteor.autorun(function() {
							var data = coll.findOne(result);

							if (data) {
								self.data(data);
							}
						});
					}
				});
			}
		});

		// Функция создаёт класс категории
		var makeCategory = function(data) {
			if (categories[data._id]) {
				_.extend(categories[data._id]._data, data);

				return categories[data._id];
			} else {
				return categories[data._id] = _.extend(new CategoryConstructor(data), new CommonConstructor());
			}
		};

		// Функция ищет в каталоге категории по названию
		var find = function(title, parentId) {
			check(title, String);
			check(parentId, Match.Optional(Match.OneOf(String, [String])));

			var regex = new RegExp(title, 'ig');
			var query = {
				type: 'category',
				title: { $regex: regex }
			};

			if (parentId) {
				query.parentId = _.isArray(parentId) ? { $in: parentId } : parentId;
			}

			return coll.find(query, { transform: makeCategory });
		};

		var CommonConstructor = (function() {
			function common() {
				// Метод возвращает ID
				this.id = function() {
					return this.data()._id;
				};
				// Метод возвращает данные
				this.data = function(data) {
					check(data, Match.Optional(Object));

					if (data && !_.isEmpty(data)) {
						_.extend(this._data, data);
					}

					return this._data;
				};
				// Метод возвращает тип
				this.type = function() {
					return this.data().type;
				};
				// Метод возвращает заголовок
				this.title = function(title) {
					check(title, Match.Optional(String));

					var data = title ? { title: title } : {};

					return this.data(data).title;
				};
				// Метод возвращает описание
				this.description = function(description) {
					check(description, Match.Optional(String));

					var data = description ? { description: description } : {};

					return this.data(data).description || '';
				};
				// Метод проверяет наличие непосредственных потомков
				this.hasChildren = function() {
					return !!this.data().cc;
				};
				// Метод возвращает количество непосредственных потомков
				this.childCount = function() {
					return this.data().cc;
				};
				// Метод создаёт категорию
				this.createChild = function(data, cb) {
					check(data, Match.OneOf(String, Match.ObjectIncluding({ title: String })));

					if (_.isString(data)) {
						data = { title: data };
					} else {
						data = {
							title: data.title
						};
					}

					data.type = 'category';
					data.parentId = this.id();
					data.catalogId = self.data()._id;

					check(data, Schemas.Catalog);

					var id = coll.insert(data, cb || this.logError);

					return makeCategory(coll.findOne(id));
				};
				// Метод возвращает непосредственного потомка
				this.childById = function(id) {
					check(id, String);

					return coll.find({ _id: id, parentId: this.id(), limit: 1 }).map(function(doc) {
						return makeCategory(doc);
					});
				};
				// Метод возвращает непосредственных потомков
				this.getChildren = function(title) {
					check(title, Match.Optional(String));

					if (title) {
						return find(title, this.id());
					} else {
						return coll.find({ parentId: this.id() }).map(function(doc) {
							return makeCategory(doc);
						});
					}
				};
				// Метод возвращает потомков
				this.findChild = function(title) {
					check(title, Match.Optional(String));

					// Функция находит всех потомков
					function getChildrenIds(ids) {
						var arr = title ? find(title, ids) : coll.find({ parentId: { $in: ids } }).map(function(doc) {
							return makeCategory(doc);
						});

						if (title) {
							var arrIds = coll.find({ parentId: { $in: ids } }).map(function(val) { return val._id; });

							if (arrIds.length) {
								arr = _.union(arr, getChildrenIds(arrIds));
							}
						} else {
							if (arr.length) {
								arr = _.union(arr, getChildrenIds(_.map(arr, function (val) { return val.id(); })));
							}
						}

						return arr;
					}

					return getChildrenIds([this.id()]);
				};
				// Метод сохраняет данные
				this.save = function() {
					coll.update(this.id(), { $set: this.data() });
				};
				// Метод логирует ошибки
				this.logError = function(error) {
					if (error) {
						console.log(error);
					}
				};
			}

			return common;
		}());

		var CategoryConstructor = (function() {
			function category(data) {
				check(data, Object);

				this._data = data;

				// Метод возвращает родителя
				this.parent = function() {
					var doc = coll.findOne(this.data().parentId);

					return doc.type == 'catalog' ? self : makeCategory(doc);
				};
				// Метод возвращает каталог
				this.catalog = function() {
					return self;
				};
				// Метод меняет родителя
				this.moveTo = function(parentId, cb) {
					check(parentId, String);

					if (this.data().parentId != parentId && this.id() != parentId && coll.findOne(parentId)) {
						coll.update(this.id(), { $set: { parentId: parentId } }, cb || this.logError);
					}
				};
				// Метод удаляет категорию
				this.remove = function(cb) {
					var id = this.id();

					coll.remove(id, cb || this.logError);
					delete categories[id];
				};
			}

			return category;
		}());

		this.ready = function() {
			return ready.get();
		};

		_.extend(this.constructor.prototype, new CommonConstructor());
	}

	return catalog;
}());