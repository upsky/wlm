Meteor.publish('catalog', function(catalogId) {
	var query = catalogId ? { $or: [{ _id: catalogId }, { catalogId: catalogId }] } : {};
	return CatalogCollection.find(query);
});

Meteor.publish('goods', function() {
	return GoodsCollection.find();
});

var node = new Elastic.Node(Meteor.settings.elasticsearch.host);

var logger = new Elastic.Logger();
logger.watch(GoodsCollection);

var sync = new Elastic.Sync(node, 'catalog', SyncCollection, logger);
sync.add(GoodsCollection, ['title', 'description', 'imageUrl']);

var search = new Elastic.Search('catalog');
search.onPerform(function (query, callback) {
	var opts = {
		index: 'catalog',
		type: 'goods',
		analyzer: 'russian_morphology',
		q: query.text.trim()
	};
	if (query.sort && sorting.hasOwnProperty(query.sort))
		opts.sort = sorting[query.sort];
	node.search(opts, callback);
});

var sorting = {
	name_asc: 'title:asc',
	name_desc: 'title:desc'
};
