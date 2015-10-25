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
Template.scheduleEdit.onRendered(function () {
	var data = db.business.findOne({ownerId: Meteor.userId()}).schedule;
	if (!_.isEmpty(data)) {
		$('[name="days.0"]').val(data.mon);
		$('[name="days.1"]').val(data.tue);
		$('[name="days.2"]').val(data.wed);
		$('[name="days.3"]').val(data.thu);
		$('[name="days.4"]').val(data.fri);
		$('[name="days.5"]').val(data.sat);
		$('[name="days.6"]').val(data.sun);
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