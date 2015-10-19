
CatalogCollection.allow({
	insert: function(userId, doc) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	},
	update: function(userId, doc, fields, modifier) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	},
	remove: function(userId, doc) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	}
});

CatalogCollection.find().observe({
	added: function(doc) {
		// Обновляем счётчик потомков родителя
		if (doc.parentId) {
			CatalogCollection.update(doc.parentId, { $inc: { cc: 1 } });
		}
	},
	changed: function(newDoc, oldDoc) {
		// Обновляем счётчики старого и нового родителя
		if (newDoc.parentId != oldDoc.parentId) {
			CatalogCollection.update(newDoc.parentId, { $inc: { cc: 1 } });
			CatalogCollection.update(oldDoc.parentId, { $inc: { cc: -1 } });
		}
	},
	removed: function(doc) {
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
});