Meteor.publish('catalog', function(catalogId) {
	var query = catalogId ? { $or: [{ _id: catalogId }, { catalogId: catalogId }] } : {};
	return CatalogCollection.find(query);
});

Meteor.publish('goods', function() {
	return GoodsCollection.find(); //{ _removed: { $not: true } });
});

var node = new Elastic.Node(Meteor.settings.elasticsearch.host);

var logger = new Elastic.Logger();
logger.watch(GoodsCollection);

var sync = new Elastic.Sync(node, 'bookstore', SyncCollection, logger);
sync.add(GoodsCollection, ['title', 'description', 'imageUrl']);

var search = new Elastic.Search('catalog');
search.onPerform(function (query, callback) {
	node.search({
		index: 'catalog',
		type: 'goods',
		analyzer: 'russian_morphology',
		q: query
	}, callback);
});
