var template = Template.verifyEmail;

template.helpers({
	emailVerified: function () {
		return Session.get('emailVerified');
	}
})