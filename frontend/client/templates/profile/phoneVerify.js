var template = Template.phoneVerify;

template.events({
	'click #delete-number': function () {
		Meteor.call('removeMyPhone');
	},
	'click #send-phone-verification': function () {
		var phone = Meteor.user().profile.phones[0].number;

		Meteor.call('sendVerifyCodePhone', { phone: phone }, function (res) {
			if (res instanceof Error) {
				WlmNotify.create({
					text: TAPi18n.__(res.reason),
					type: 'error'
				})
			} else {
				WlmNotify.create({
					text: TAPi18n.__('messages.phoneVerificationSend'),
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
	phoneExist: function () {
		return (Meteor.user().profile.phones && Meteor.user().profile.phones.length > 0 ? true : false);
	},
	phoneVerified: function () {
		return (Meteor.user().profile.phones && Meteor.user().profile.phones.length && Meteor.user().profile.phones[0].verified ? true : false)
	},
	formType: function () {
		return Meteor.user().profile.phones && Meteor.user().profile.phones.length > 0 ? 'disabled' : 'method';
	}
});

AutoForm.hooks({
	verifyPhone: {
		onError: function (type, error) {
			console.log(error)
			WlmNotify.create({
				type: 'error',
				text: TAPi18n.__(error.reason)
			});
		},
		onSuccess: function (type, res) {
			WlmNotify.create({
				type: 'success',
				text: TAPi18n.__('messages.changesSaved')
			});

		}
	}
});
