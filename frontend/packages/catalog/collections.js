
CatalogCollection = new Mongo.Collection('catalog');

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