WlmSecurity.addPublish({
	verificationCode: {
		roles: 'all'
	}
});


Meteor.publish('verificationCode', function (phoneNumber) {
	check(phoneNumber, String);

	return db.verificationCode.find(
		{ userId: this.userId, phoneNumber: phoneNumber },
		{
			fields: { code: 0 }
		}
	);
});