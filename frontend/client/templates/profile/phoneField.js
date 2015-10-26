var template = Template.phoneField;

template.onRendered(function () {
	//this.user = Meteor.user;

});


template.helpers({
	phoneField: {
		blockId: "phoneField"
	},
	user: function () {
		return Meteor.user();
	},
	disabled: function () {
		return (Meteor.user().profile.phones[0].number === '' ? '' : 'disabled');
	}
});