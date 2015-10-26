Meteor.methods({
	'sendSms': function (doc) {
		check(doc, {
			phoneNumber: String,
			text: String
		});
		var text = doc.text.replace(' ', '+');
		var phoneNumber = doc.phoneNumber;
		var apiId = Meteor.settings.smsRuApiKey;
		var url = 'http://sms.ru/sms/send?api_id=' + apiId + '&to=' + phoneNumber + '&text=' + text;

		HTTP.post(url, function (res) {
			console.log('HTTP.post res', res);
		});
	}
});