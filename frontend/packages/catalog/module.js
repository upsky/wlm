
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
				Meteor.call('createCatalog', catName, function(error, result) {
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
				var category = categories[data._id] = _.extend(new CategoryConstructor(data), new CommonConstructor());

				category.goods = new GoodsConstructor(category.id());

				return category;
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
					Meteor.apply('createCategory', [data, this.id(), self.id()], function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							cb(makeCategory(coll.findOne(result)));
						}
					});
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
				this.save = function(cb) {
					Meteor.call('updateCategory', this.data(), function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							cb(result);
						}
					});
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
				// Метод возвращает путь до категории
				this.path = function() {
					var path = [this];
					var parent = this.parent();

					while(parent.type() != 'catalog') {
						path.push(parent);

						parent = parent.parent();
					}

					return path;
				};
				// Метод возвращает каталог
				this.catalog = function() {
					return self;
				};
				// Метод меняет родителя
				this.moveTo = function(parentId, cb) {
					Meteor.apply('moveCategory', [this.id(), parentId], function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							cb(result);
						}
					});
				};
				// Метод удаляет категорию
				this.remove = function(cb) {
					Meteor.call('removeCategory', this.id(), function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							delete categories[id];
							cb(result);
						}
					});
				};
			}

			return category;
		}());

		this.ready = function() {
			return ready.get();
		};

		_.extend(this.constructor.prototype, new CommonConstructor());





		var GoodsConstructor = (function() {
			function goods(categoryId) {
				var goods = {};
				var ready = new ReactiveVar(false);
				var goodsColl = GoodsCollection;
				var sub = Meteor.subscribe('goods', function() {
					ready.set(true);
				});

				// Функция создаёт класс продукта
				var makeProduct = function(data) {
					if (goods[data._id]) {
						_.extend(goods[data._id]._data, data);

						return goods[data._id];
					} else {
						return goods[data._id] = new ProductConstructor(data);
					}
				};

				// Метод возвращает непосредственного потомка
				this.childById = function(id) {
					check(id, String);

					return goodsColl.find({ _id: id, limit: 1 }).map(function(doc) {
						return makeProduct(doc);
					});
				};
				// Метод возвращает количество товаров в категории
				this.childCount = function() {
					return goodsColl.find({ categories: { $all: [categoryId] } }).count();
				};
				// Метод возвращает товары из категории
				this.getChildren = function() {
					return goodsColl.find({ categories: { $all: [categoryId] } }).map(function(doc) {
						return makeProduct(doc);
					});
				};
				// Метод создаёт товар
				this.createChild = function(data, cb) {
					Meteor.apply('createProduct', [data, categoryId], function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							cb(makeProduct(goodsColl.findOne(result)));
						}
					});
				};

				this.ready = function() {
					return ready.get();
				};
			}

			return goods;
		}());

		var ProductConstructor = (function() {
			function product(data) {
				check(data, Object);

				this._data = data;

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
				// Метод возвращает адрес картинки
				this.imageUrl = function(imageUrl) {
					check(imageUrl, Match.Optional(String));

					var data = imageUrl ? { imageUrl: imageUrl } : {};

					return this.data(data).imageUrl || '';
				};
				// Метод сохраняет данные
				this.save = function(cb) {
					Meteor.call('updateProduct', this.data(), function(error, result) {
						if (error) {
							self.logError(error);
						} else if (cb) {
							cb(result);
						}
					});
				};
			}

			return product;
		}());
	}

	return catalog;
}());