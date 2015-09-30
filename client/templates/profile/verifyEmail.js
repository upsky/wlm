var template = Template.verifyEmail;
var emailNotVerified = new ReactiveVar(true);
template.helpers({
	emailNotVerified: function () {
		return emailNotVerified.get();
	}
});


template.events({
	"click [name='resendEmailVerified']": function () {
		Meteor.call('resendVerificationEmail');
	}
});
template.onRendered(function () {
	Meteor.autorun(function () {
		Meteor.user().emails.forEach(function (item) {
			if (item.verified === true)emailNotVerified.set(false);
		});
	})
});
