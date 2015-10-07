Meteor.startup(function () {
	Accounts.emailTemplates.resetPassword.from = function () {
		return Meteor.settings.supportEmail;
	};
	Accounts.emailTemplates.resetPassword.subject = function () {
		return 'Восстановление пароля WL Market';
	};

	Accounts.emailTemplates.resetPassword.html = function (user, resetLink) {
		check(user, Object);
		check(resetLink, String);

		var html = SSR.render('resetPasswordEmail', {
			resetLink: resetLink
		});
		return html;
	};

	Accounts.emailTemplates.verifyEmail.from = function () {
		return Meteor.settings.verifyEmail;
	};
	Accounts.emailTemplates.verifyEmail.subject = function () {
		return 'Подтверждение почты WL Market';
	};
	Accounts.emailTemplates.verifyEmail.html = function (user, verifyLink) {
		var html = SSR.render('invitePartnerEmail', {
			regLink: verifyLink
		});

		return html;
	};
});
