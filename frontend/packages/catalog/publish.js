
Meteor.publish('catalogImages', function() {
	return ImagesCollection.find();
});

Meteor.publish('catalog', function(catalogId) {
	var query = catalogId ? { $or: [{ _id: catalogId }, { catalogId: catalogId }] } : {};

	return CatalogCollection.find(query);
});

Meteor.publish('goods', function(categoryId) {
	return GoodsCollection.find({ categories: { $all: [categoryId] } });
});