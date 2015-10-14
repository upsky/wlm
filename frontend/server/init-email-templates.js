/**
 * Created by kriz on 06/10/15.
 */

// init all email templates here
Meteor.startup(function () {
	['invitePartner', 'resetPassword'].
		forEach(function (templateName) {
			SSR.compileTemplate(templateName + 'Email', Assets.getText('emailTemplates/' + templateName + '.html'));
		});
});