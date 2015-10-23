Template.profile.events({
	'click [name=business]': function() {
		if (db.business.findOne({ownerId: Meteor.user()._id})) {
			Router.go('business');
		} else {
			Modal.show('businessCreate');
		}
	}
});