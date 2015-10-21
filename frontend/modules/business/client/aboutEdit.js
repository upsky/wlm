Template.aboutEdit.helpers({
	business: function () {
		return db.business.findOne({ownerId: Meteor.user()._id});
	}
});
Template.aboutEdit.events({
	'click [name=back]': function() {
		Modal.hide();
	}
});
AutoForm.hooks({
	aboutEdit: {
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