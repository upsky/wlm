AutoForm.hooks({
	profileForm: {
		onError: function (type, error) {
			WlmNotify.create({
				type: 'error',
				text: error
			});
		},
		onSuccess: function (type, res) {
			WlmNotify.create({
				type: 'success',
				text: TAPi18n.__('messages.saveChanges')
			});

		}
	}
});


Template.personalInf.rendered = function () {
	return log.trace('personalInf rendered');
};

Template.personalInf.helpers({
	personalInf: {
		blockId: "personalInf"
	},
	user: function () {
		return Meteor.user();
	}
});

Template.personalInf.events({
	"click #personalInf": function (event) {
		return log.trace('click #personalInf');
	}
});
