Meteor.publish('catalog', function(catalogId) {
	var query = catalogId ? { $or: [{ _id: catalogId }, { catalogId: catalogId }] } : {};
	return CatalogCollection.find(query);
});

Meteor.publish('goods', function() {
	return GoodsCollection.find(); //{ _removed: { $not: true } });
});

var node = new Elastic.Node(Meteor.settings.elasticsearch.host);
node.sync(GoodsCollection, 'catalog/goods', {
  serialize: ['title', 'description', 'imageUrl'],
  fields: {
		id: '_id',
		created: '_created',
		updated: '_updated',
		removed: '_removed'
	},
  updated: function (date) {
    if (date) {
      SyncCollection.upsert('goods', { value: date });
    } else {
      var found = SyncCollection.findOne('goods');
      return found ? found.value : null;
    }
  }
});

var search = new Elastic.Search('catalog');
search.onPerform(function (query, callback) {
	node.search({
		index: 'catalog',
		type: 'goods',
		analyzer: 'russian_morphology',
		q: query
	}, callback);
});
