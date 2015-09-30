var onResetPasswordLinkDone;
var template = Template.login;

Accounts.onResetPasswordLink(function (token, done) {
	onResetPasswordLinkDone = done;
	Session.set('resetToken', token);
});

Accounts.onEmailVerificationLink(function (token, done) {
	Accounts.verifyEmail(token, function () {
		Session.set('emailVerified', true);

		new PNotify({
			type: 'success',
			text: TAPi18n.__('messages.emailVerified')
		});

		Router.go('/');
	})
});

template.helpers({
	resetToken: function () {
		return Session.get('resetToken');
	}
});


AutoForm.hooks({
	resetPassForm: {
		onSubmit: function (doc) {

			Accounts.resetPassword(Session.get('resetToken'), doc.newPass, function () {
				onResetPasswordLinkDone();

				Router.go('/');

				new PNotify({
					type: 'success',
					text: TAPi18n.__('messages.passwordChanged')
				});
			});

			return false;
		},
		onError: function (type, error) {
			return new PNotify({
				type: 'error',
				text: error
			});
		}
	}
});

