var template = Template.verifyEmail;
var emailNotVerified = new ReactiveVar(true);
var emailSended = new ReactiveVar(false);
template.helpers({
	emailNotVerified: function () {
		return emailNotVerified.get();
	},
	emailSended: function () {
		return emailSended.get();
	}
});


template.events({
	"click [name='resendEmailVerified']": function () {
		if (!emailSended.get())
			Meteor.call('resendVerificationEmail', function () {
				emailSended.set(true);
				new PNotify({
					type: 'success',
					text: TAPi18n.__('messages.emailSend')
				});
			});
	}
});
template.onRendered(function () {
	Meteor.autorun(function () {
		Meteor.user().emails.forEach(function (item) {
			if (item.verified === true)emailNotVerified.set(false);
		});
	})
});
