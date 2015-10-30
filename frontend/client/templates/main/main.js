
var template = Template.main;
var mainCatalogTemplate = Template.mainCatalog;
var mainCatalogItemTemplate = Template.mainCatalogItem;
var mainCategoryItemTemplate = Template.mainCategoryItem;

template.helpers({
	catalogs: function() {
		return this.ready() ? this.getChildren().slice(0, 2) : [];
	},
	catalogItems: function() {
		return this.ready() ? this.getChildren().slice(0, 3) : [];
	}
});

mainCatalogTemplate.helpers({
	categories: function() {
		return this.getChildren().slice(0, 6);
	}
});

mainCatalogItemTemplate.helpers({
	items: function() {
		var allChildrens = this.findChild();
		var allGoods = [];

		_.find(allChildrens, function(val) {
			if (val.goods.ready()) {
				allGoods = allGoods.concat(val.goods.getChildren());
				return false;
			} else {
				return true;
			}
		});

		return allGoods.length && allGoods.splice(0, 6);
	}
});

mainCategoryItemTemplate.helpers({
	background: function() {
		return 'background-image: url(' + (this.imageUrl() || '/images/no_photo.jpg') + ')';
	}
});