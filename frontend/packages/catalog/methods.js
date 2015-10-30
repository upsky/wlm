
Meteor.methods({
	// Метод создания каталога
	createCatalog: function(name) {
		check(name, String);

		return CatalogCollection.insert({ title: name, type: 'catalog' });
	},
	// Метод создания категории
	createCategory: function(data, parentId, catalogId) {
		check(data, Match.OneOf(String, Match.ObjectIncluding({ title: String })));

		if (_.isString(data)) {
			data = { title: data };
		}

		data.title = data.title.trim();
		data.description = data.description ? data.description.trim() : '';

		data.type = 'category';
		data.parentId = parentId;
		data.catalogId = catalogId;

		check(data, Schemas.Catalog);

		var id = CatalogCollection.insert(data);

		// Обновляем счётчик потомков родителя
		if (id) {
			CatalogCollection.update(parentId, { $inc: { cc: 1 } });
		}

		return id;
	},
	// Метод обновления категории
	updateCategory: function(data) {
		check(data, Object);

		var id = data._id;

		delete data._id;

		check(data, Schemas.Catalog);

		return !!CatalogCollection.update(id, { $set: data });
	},
	// Метод перемещения (смены родителя) категории
	moveCategory: function(id, newParentId) {
		check(id, String);
		check(newParentId, String);

		var doc = CatalogCollection.findOne(id);
		var newParentDoc = CatalogCollection.findOne(newParentId);

		if (!doc) {
			throw new Meteor.Error(400, 'Category not found');
		}

		if (!newParentDoc) {
			throw new Meteor.Error(400, 'Destination category not found');
		}

		if (doc.parentId != newParentId && id != newParentId) {
			var updatedCnt = CatalogCollection.update(id, { $set: { parentId: newParentId } });

			// Обновляем счётчики старого и нового родителя
			CatalogCollection.update(newParentId, { $inc: { cc: 1 } });
			CatalogCollection.update(doc.parentId, { $inc: { cc: -1 } });

			return !!updatedCnt;
		}
	},
	// Метод удаления категории
	removeCategory: function(id) {
		check(id, String);

		var doc = CatalogCollection.findOne(id);

		if (!doc) {
			throw new Meteor.Error(400, 'Category not found');
		}

		var removedCnt = CatalogCollection.remove(id);

		if (removedCnt) {
			// Обновляем счётчик потомков родителя
			if (doc.parentId) {
				CatalogCollection.update(doc.parentId, { $inc: { cc: -1 } });
			}

			// Функция находит всех потомков
			function getChildrenIds(ids) {
				var arrIds = CatalogCollection.find({ parentId: { $in: ids } }, { fields: { _id: 1 } }).map(function(doc) {
					return doc._id;
				});

				if (arrIds.length) {
					arrIds = _.union(arrIds, getChildrenIds(arrIds));
				}

				return arrIds;
			}

			var needRemove = getChildrenIds([doc._id]);

			// Удаляем всех потомков
			if (needRemove.length) {
				CatalogCollection.remove({ _id: { $in: needRemove } }, function(error, result) {});
			}
		}

		return !!removedCnt;
	},

	// Метод создания продукта
	createProduct: function(data, categoryId) {
		check(data, Match.OneOf(String, Match.ObjectIncluding({ title: String })));
		check(categoryId, String);

		var category = CatalogCollection.findOne(categoryId);

		if (!category) {
			throw new Meteor.Error(400, 'Category not found');
		}

		if (_.isString(data)) {
			data = { title: data };
		}

		data.title = data.title.trim();
		data.description = data.description ? data.description.trim() : '';

		data.categories = [categoryId];

		if (data.imageId && data.imageUrl) {
			delete data.imageUrl;
		}

		check(data, Schemas.Goods);

		return GoodsCollection.insert(data);
	},
	// Метод обновления продукта
	updateProduct: function(data) {
		check(data, Object);

		var id = data._id;

		delete data._id;

		if (data.imageId && data.imageUrl) {
			delete data.imageUrl;
		}

		check(data, Schemas.Goods);

		return !!GoodsCollection.update(id, { $set: data });
	},
	// Метод добавляет картинку продукта
	setProductImage: function(image, productId) {
		check(image, String);
		check(productId, String);

		var product = GoodsCollection.findOne(productId);

		if (!product) {
			throw new Meteor.Error(400, 'Product not find');
		}

		var fsFile = new FS.File();

		fsFile.metadata = {
			productId: productId,
			uploadedUserId: this.userId

		};

		fsFile.attachData(image, function(error) {
			if (error) {
				throw new Meteor.Error(400, 'Error loading image');
			}

			var fileObj = ImagesCollection.insert(fsFile);
		});
	}
});