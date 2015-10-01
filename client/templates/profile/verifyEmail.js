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
		if (!emailSended.get()) {
			Meteor.call('resendVerificationEmail');
			emailSended.set(true);
			new PNotify({
				type: 'success',
				text: TAPi18n.__('messages.emailSend')
			});
		}
	}
});
template.onRendered(function () {
	Meteor.autorun(function () {
		var user = Meteor.user();
		if (!user)
			return;

		var verified = _.any(user.emails, function (item) {
			return item.verified;
		});
		emailNotVerified.set(verified);
	})
});
