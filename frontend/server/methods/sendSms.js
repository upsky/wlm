var sendSms = function (doc) {
	check(doc, {
		phoneNumber: String,
		text: String
	});

	var text = doc.text.replace(' ', '+');
	var phoneNumber = doc.phoneNumber;
	var apiId = Meteor.settings.smsRuApiKey;
	var url = 'http://sms.ru/sms/send?api_id=' + apiId + '&to=' + phoneNumber + '&text=' + text;

	if (!Meteor._get(Meteor.user(), "profile", "phones")) {
		throw new Meteor.Error(400, 'errors.phoneNotFound');
	}

	var phones = Meteor.user().profile.phones;

	phones.forEach(function (phoneNumber) {
		if (phoneNumber === doc.phoneNumber) {
			HTTP.post(url, function (res) {
				console.log('HTTP.post res', res);
			});
		}
	});


};
Meteor.methods({
	'sendMeVerifySms': function (doc) {
		check(doc, {
			phoneNumber: String,
			text: String
		});

		sendSms(doc);
	}
});