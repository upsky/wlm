
var template = Template.storeButton;

template.helpers({
	isType: function(type) {
		return type === this.type;
	}
});