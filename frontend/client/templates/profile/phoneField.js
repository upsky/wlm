var template = Template.phoneField;

template.onRendered(function () {
	//this.user = Meteor.user;

});

template.events({
	'click #delete-number': function () {
		Meteor.call('removeMyPhone');
	},
	'click #send-phone-verification': function () {
		Meteor.call('sendVerifyCodePhone', function (res) {
			console.log(res);

			if (res instanceof Error) {
				WlmNotify.create({
					text: TAPi18n.__(res.reason),
					type: 'error'
				})
			} else {
				WlmNotify.create({
					text: TAPi18n.__('message.phoneVerificationSend'),
					type: 'success'
				})
			}

		});
	}
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