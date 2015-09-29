/**
 * @param templateName
 * @param templateContent
 * @param mergeVars
 * @returns String
 * @constructor
 */
var MandrillGetHtml = function (templateName, mergeVars) {
	var result;
	try {
		result = Mandrill.templates.render({
			template_name: templateName,
			template_content: [{
				name: 'body',
				content: ''
			}],
			merge_vars: mergeVars
		});
	} catch (error) {
		console.error('Error while rendering Mandrill template', error);
	}
	return result.data.html;
};

Meteor.startup(function () {
	Mandrill.config(Meteor.settings.mandrill);


	Accounts.emailTemplates.resetPassword.html = function (user, resetLink) {
		check(user, Object);
		check(resetLink, String);

		return MandrillGetHtml('resetPassword',
			[{
				name: 'resetLink',
				content: resetLink
			}]);
	};

	Accounts.emailTemplates.verifyEmail.html = function (user, verifyLink) {
		return MandrillGetHtml('verifyEmail',
			[{
				name: 'verifyLink',
				content: verifyLink
			}]
		);
	};
});
