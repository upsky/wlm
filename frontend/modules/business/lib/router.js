Router.route('/business', {
	layoutTemplate: 'fullLayout',
	template: 'business',
	name: 'business',
	waitOn: function () {
		return [
			Meteor.subscribe('business', {ownerId: Meteor.user()._id}),
			Meteor.subscribe('images', {ownerId: this.userId})
		];
	}
});
Router.route('/business/edit/:_id', {
	layoutTemplate: 'fullLayout',
	template: 'businessEdit',
	name: 'businessEdit',
	waitOn: function () {
		return [
			Meteor.subscribe('business', {ownerId: Meteor.user()._id}),
			Meteor.subscribe('images', {ownerId: this.userId})
		];
	},
	data: function () {
		return db.business.findOne({ _id: this.params._id });
	}
});