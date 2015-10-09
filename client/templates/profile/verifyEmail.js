var template = Template.verifyEmail;
var emailVerified = new ReactiveVar(true);
var emailSended = new ReactiveVar(false);
template.helpers({
	emailVerified: function () {
		return emailVerified.get();
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
			WlmNotify.create({
				type: 'success',
				text: 'messages.emailSend'
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
		emailVerified.set(verified);
	})
});
