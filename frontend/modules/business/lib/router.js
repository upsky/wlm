Router.route('/business', {
	layoutTemplate: 'fullLayout',
	template: 'business',
	name: 'business',
	waitOn: function () {
		return [
			Meteor.subscribe('business', {ownerId: Meteor.user()._id}),
			Meteor.subscribe('images')
		];
	}
});