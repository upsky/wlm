var template = Template.verifyEmail;
var emailVerified = new ReactiveVar(true);
var emailSent = new ReactiveVar(false);
template.helpers({
	emailVerified: function () {
		return emailVerified.get();
	},
	emailSent: function () {
		return emailSent.get();
	},

	supportEmail: function () {
		return Meteor.pubSettings('email', 'support');
	}
});


template.events({
	"click [name='resendEmailVerified']": function () {
		if (!emailSent.get()) {
			Meteor.call('resendVerificationEmail');
			emailSent.set(true);
			WlmNotify.create({
				type: 'success',
				text: 'messages.emailSent'
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
