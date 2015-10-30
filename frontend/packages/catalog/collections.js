
ImagesCollection = new FS.Collection('catalogImages', {
	stores: [
		new FS.Store.FileSystem('thumbs', {
			beforeWrite: function(fileObj) {
				return {
					extension: 'png',
					type: 'image/png'
				};
			},
			transformWrite: function(fileObj, readStream, writeStream) {
				gm(readStream, fileObj.name()).resize('200', '200^').gravity('Center').extent('200', '200').quality(75).level('20', '100%', '0.80').stream('PNG').pipe(writeStream);
			},
			path: '~/meteor/wlm/uploads/catalog/products/thumbs'
		}),
		new FS.Store.FileSystem('fullImages', {
			beforeWrite: function(fileObj) {
				return {
					extension: 'png',
					type: 'image/png'
				};
			},
			path: '~/meteor/wlm/uploads/catalog/products/images'
		})
	],
	filter: {
		maxSize: 10 * 1024 * 1024,
		allow: {
			contentTypes: ['image/*']
		}
	}
});

CatalogCollection = new Mongo.Collection('catalog');
GoodsCollection = new Mongo.Collection('goods');

Schemas = {};

Schemas.Catalog = new SimpleSchema({
	title: {
		type: String,
		label: '"Title"',
		min: 2,
		max: 100
	},
	type: {
		type: String,
		label: '"Type"',
		max: 50
	},
	description: {
		type: String,
		label: '"Description"',
		max: 200,
		optional: true
	},
	parentId: {
		type: String,
		label: '"Parent ID"',
		max: 100,
		custom: function() {
			var type = this.field('type').value;

			if (type == 'category') {
				if (!this.isSet) {
					return 'required';
				}
				if (!CatalogCollection.findOne(this.value)) {
					return 'badId';
				}
			}
			return true;
		},
		optional: true
	},
	catalogId: {
		type: String,
		label: '"Catlog ID"',
		max: 100,
		custom: function() {
			var type = this.field('type').value;

			if (type == 'category') {
				if (!this.isSet) {
					return 'required';
				}
				if (!CatalogCollection.findOne(this.value)) {
					return 'badId';
				}
			}
		},
		optional: true
	},
	cc: {
		type: Number,
		label: '"Children count"',
		decimal: true,
		defaultValue: 0,
		optional: true
	}
});

Schemas.Catalog.messages({
	'badId': '[label] is not a valid ID'
});

CatalogCollection.attachSchema(Schemas.Catalog);


Schemas.Goods = new SimpleSchema({
	title: {
		type: String,
		label: '"Title"',
		max: 100
	},
	description: {
		type: String,
		label: '"Description"',
		max: 200,
		optional: true
	},
	imageId: {
		type: String,
		label: '"Image ID"',
		optional: true
	},
	categories: {
		type: [String],
		label: '"Categories ID"'
	}
});

GoodsCollection.attachSchema(Schemas.Goods);