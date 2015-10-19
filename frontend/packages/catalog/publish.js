
Meteor.publish('catalog', function(catalogId) {
	var query = catalogId ? { $or: [{ _id: catalogId }, { catalogId: catalogId }] } : {};

	return CatalogCollection.find(query);
});