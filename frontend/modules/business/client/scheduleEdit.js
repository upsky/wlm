Template.scheduleEdit.helpers({
	business: function () {
		return db.business.findOne({ownerId: Meteor.user()._id});
	}
});
Template.scheduleEdit.events({
	'click [name=back]': function() {
		Modal.hide();
	}
});
AutoForm.hooks({
	scheduleEdit: {
		onError: function (type, error) {
			console.log(error);
		},
		onSuccess: function (type, result) {
			WlmNotify.create({
				title: 'messages.changesSaved',
				type: 'success'
			});
			Modal.hide();
		}
	}
});