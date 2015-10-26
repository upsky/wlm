var Sms = function () {
	var deltaMinute = 60 * 1000;
	var deltaHour = 60 * deltaMinute;
	var deltaDay = 24 * deltaHour;
	var deltaWeek = 7 * deltaDay;

	var quotaPerMinute = 2;
	var quotaPerHour = 5;
	var quotaPerDay = 10;
	var quotaPerWeek = 20;

	/**
	 *
	 * @returns {any}
	 */
	function getDensity (time) {
		var currentTime = new Date().getTime();

		return db.sms.find(
			{
				userId: Meteor.userId(),
				created: { $gte: currentTime - time }
			},
			{
				sort: { created: -1 }
			}).count();
	}

	/**
	 * check quota sms send
	 */
	function checkQuota () {
		if (getDensity(deltaMinute) === quotaPerMinute) {
			throw new Meteor.Error(400, 'errors.smsQuotaPerMinute');
		}

		if (getDensity(deltaHour) === quotaPerHour) {
			throw new Meteor.Error(400, 'errors.smsQuotaPerHour');
		}

		if (getDensity(deltaDay) === quotaPerDay) {
			throw new Meteor.Error(400, 'errors.smsQuotaPerDay');
		}

		if (getDensity(deltaWeek) === quotaPerWeek) {
			throw new Meteor.Error(400, 'errors.smsQuotaPerWeek');
		}
	}

	function send (doc) {
		check(doc, smsSchemas);
		checkQuota();

		var text = doc.text.replace(' ', '+');
		var phoneNumber = doc.to;

		var apiId = Meteor.settings.smsRuApiKey;
		var url = 'http://sms.ru/sms/send?api_id=' + apiId + '&to=' + phoneNumber + '&text=' + text;


		HTTP.get(url, function (_, res) {
			db.sms.insert({
				to: phoneNumber,
				text: text,
				statusCode: res.statusCode,
				content: res.content,
				created: new Date().getTime(),
				userId: Meteor.userId()
			});
		});
	}

	return {
		send: send
	}
};
WLmSms = new Sms();


