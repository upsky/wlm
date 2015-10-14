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

