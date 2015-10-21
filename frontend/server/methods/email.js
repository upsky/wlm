/**
 * Created by kriz on 06/10/15.
 */

WlmUtils = {};

WlmUtils.sendEmail = function (to, from, subject, templateName, data) {
	check([to, from, subject, templateName], [String]);
	check(data, Object);

	var html = SSR.render(templateName, data);

	//console.log(html);

	Email.send({
		to: to,
		from: from,
		subject: subject,
		html: html
	});
};

WlmUtils.verifyEmail = function (email) {
	check(email, String);

	return db.users.update(
		{ 'emails.address': email },
		{ $set: { 'emails.$.verified': true } }
	);
};

// init all email templates here
Meteor.startup(function () {
	['invitePartner', 'resetPassword'].
	forEach(function (templateName) {
		SSR.compileTemplate(templateName + 'Email', Assets.getText('emailTemplates/' + templateName + '.html'));
	});
});

//configure account emails
Meteor.startup(function () {
	Accounts.emailTemplates.resetPassword.from = function () {
		return Meteor.pubSettings('email', 'verify');
	};
	Accounts.emailTemplates.resetPassword.subject = function (user) {
		// TODO get user language and send correct email
		return TAPi18n.__('messages.passwordRecoverySubject', 'ru');
	};

	Accounts.emailTemplates.resetPassword.html = function (user, resetLink) {
		var html = SSR.render('resetPasswordEmail', {
			resetLink: resetLink,
			rootUrl: Meteor.absoluteUrl()
		});
		return html;
	};

	Accounts.emailTemplates.verifyEmail.from = function () {
		return Meteor.pubSettings('email', 'verify');
	};
	Accounts.emailTemplates.verifyEmail.subject = function () {
		return TAPi18n.__('messages.emailVerificationSubject', 'ru');
	};
	Accounts.emailTemplates.verifyEmail.html = function (user, verifyLink) {
		var html = SSR.render('invitePartnerEmail', {
			regLink: verifyLink,
			rootUrl: Meteor.absoluteUrl()
		});

		return html;
	};
});
