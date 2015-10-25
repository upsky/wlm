var VerificationCode = function () {

	/**
	 *
	 * @param min
	 * @param max
	 * @returns {*}
	 */
	function getRandomInt () {
		var min = 0;
		var max = 9;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	/**
	 *
	 * @returns {Number}
	 */
	function getCode () {
		var res = [];
		for (var i = 0; i < 6; ++i) {
			res.push(getRandomInt());
		}
		return parseInt(res.join(''), 10);
	}

	/**
	 *
	 * @param created
	 * @returns {boolean}
	 */
	function checkTimeLive (created) {
		var createdTime = created.getTime();
		var currentTime = new Date().getTime();
		var deltaTime = currentTime - createdTime;
		var limit = 3 * 60 * 1000;//3 minutes

		console.log('deltaTime', deltaTime);
		console.log('limit', limit);

		if (deltaTime < limit)
			return false;
		else
			return true;
	}

	/**
	 *
	 * @param phoneNumber
	 * @returns code
	 */
	function create (phoneNumber) {
		console.log('create');
		var code = getCode();
		var doc = {
			userId: Meteor.userId(),
			phoneNumber: phoneNumber,
			code: code,
			used: false,
			attempt: 3,
			created: new Date()
		};

		check(doc, verificationCodeSchemas);
		db.verificationCode.insert(doc);
		return code;
	}


	function checkCode (code) {
		console.log('check');
		var phone = Meteor.user().profile.phones[0].number;
		var doc = db.verificationCode.findOne({ userId: Meteor.userId(), phoneNumber: phone }, {
			sort: { created: -1 },
			limit: 1
		});

		if (!doc) {
			throw new Meteor.Error(400, 'errors.codeNotFound');
		}

		if (doc.attempt < 1) {
			throw new Meteor.Error(400, 'errors.codeAttemptEnd');
		}

		if (doc.used) {
			throw new Meteor.Error(400, 'errors.codeAlreadyUsing');
		}

		if (code !== doc.code) {
			db.verificationCode.update(doc._id, {
				$set: { attempt: --doc.attempt }
			});
			throw new Meteor.Error(400, 'errors.codeInvalid');
		}

		if (checkTimeLive(doc.created)) {
			throw new Meteor.Error(400, 'errors.codeCodeOverdue');
		}

	}


	return {
		create: create,
		checkCode: checkCode
	}
};
WLmVerificationCode = new VerificationCode();
