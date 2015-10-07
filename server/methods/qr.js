
Meteor.methods({
	qrApplyCode: function (qrCode) {
		check(qrCode, String);

		var invite = db.invites.findOne({_id: qrCode, status: 'qr'});
		if (!invite)
			throw new Meteor.Error(403, 'invite not found');

		return {
			inviteId: invite._id
		};
	},

	qrAuthCode: function () {
		var newCode = Random.secret();
		db.users.update(this.userId, {
			$set: {
				'services.qr.code': newCode,
				'services.qr.created': Date.now()
			}
		});
		return newCode;
	},
	invalidateQr: function (_id) {
		check(_id, Match.Id);

		var updCount = db.invites.update({
			_id: _id,
			status: 'qr'
		}, {
			$set: {
				status: 'active'
			}
		});

		if (updCount) {
			return Meteor.call('checkQr');
		}
	},
	checkQr: function () {
		var qr = db.invites.findOne({
			initiator: this.userId,
			status: 'qr'
		});

		if (!qr) {
			return db.invites.insert({
				status: 'qr',
				initiator: this.userId,
				email: Random.id(),
				name: ''
			});
		}
	}
});
