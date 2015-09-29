Accounts.registerLoginHandler(function (request) {
	check(request, {qrToken: String});

	var user = Meteor.users.findOne({'services.qr.code': request.qrToken});
	if (!user)
		throw new Meteor.Error(403, 'Auth denied');


	var userId = user._id;
	var stampedToken = Accounts._generateStampedLoginToken();
	var hashStampedToken = Accounts._hashStampedToken(stampedToken);

	Meteor.users.update(userId,
		{
			$push: {'services.resume.loginTokens': hashStampedToken},
			$unset: {
				'services.qr': ''
			}
		}
	);

	return {
		userId: userId,
		token: stampedToken.token
	};
});

//
//Accounts.validateLoginAttempt(function (type) {
//	// TODO verify not first email, but specified while login
//	if (type.user && type.user.emails && !type.user.emails[0].verified)
//		throw new Meteor.Error(100002, "email not verified");
//	return true;
//});