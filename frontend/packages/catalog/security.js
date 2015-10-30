
ImagesCollection.allow({
	insert: function(userId, doc) {
		check(doc.metadata, Match.ObjectIncluding({
			productId: String,
			uploadedUserId: String
		}));

		if (userId && doc.metadata.uploadedUserId == userId) {
			var userData = Meteor.users.findOne(userId);

			if (userData && userData.roles.indexOf('catalogAdmin') !== -1) {
				if (GoodsCollection.findOne(doc.metadata.productId)) {
					return true;
				}
			}
		}

		return false;
	},
	update: function() {
		return true;
	},
	download: function() {
		return true;
	}
});

ImagesCollection.on('uploaded', function(fileObj) {
	var product = GoodsCollection.findOne(fileObj.metadata.productId);

	if (product.imageId != fileObj._id) {
		ImagesCollection.remove(product.imageId);
	}

	GoodsCollection.update(fileObj.metadata.productId, {
		$set: {
			imageId: fileObj._id
		}
	});
});

CatalogCollection.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});

GoodsCollection.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});