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
		$('[name="schedule.mon"]').val(data.mon);
		$('[name="schedule.tue"]').val(data.tue);
		$('[name="schedule.wed"]').val(data.wed);
		$('[name="schedule.thu"]').val(data.thu);
		$('[name="schedule.fri"]').val(data.fri);
		$('[name="schedule.sat"]').val(data.sat);
		$('[name="schedule.sun"]').val(data.sun);
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