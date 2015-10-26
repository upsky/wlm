registerPartner = function (doc) {
	var newUserId, invite, lastInvite, path, targetPartner, uin, username;
	check(doc, Schemas.registerPartner);

	invite = db.invites.findOne(doc._id);
	if (!invite) {
		throw new Meteor.Error(400, 'Invite not found');
	}
	if (invite.status === 'used') {
		throw new Meteor.Error(400, 'Invite used');
	}

	// update invite
	db.invites.update({ _id: doc._id }, {
		$set: {
			status: 'used',
			email: doc.email,
			name: doc.name
		}
	});

	// TODO right invite invalidation
	targetPartner = db.partners.findOne(invite.initiator);
	if (!targetPartner) {
		throw new Meteor.Error(400, 'Partner not found');
	}

	// TODO right uin generation through status table
	lastInvite = db.users.findOne({}, { sort: { uin: -1 } });
	if (lastInvite) {
		uin = uinGen(Math.floor(lastInvite.uin / 10) + 1);
	}
	if (_.isNaN(uin)) {
		uin = uinGen(50);
	}

	username = '+' + uin.toString();
	newUserId = Accounts.createUser({
		username: username,
		email: doc.email,
		password: doc.newPass,
		profile: {
			name: doc.name
		}
	});

	path = _.clone(targetPartner.path);
	path.push(targetPartner._id);

	db.partners.insert({
		_id: newUserId,
		level: targetPartner.level + 1,
		path: path
	});
	Roles.addUsersToRoles(newUserId, 'partner');

	db.users.update(newUserId, { $set: { uin: uin } });

	db.invites.update(doc._id, {
		$set: {
			status: 'used',
			userId: newUserId,
			username: username,
			used: new Date()
		}
	});

	return {
		userId: newUserId,
		invite: invite
	};
};

registerPartnerWithVerification = function (doc, captcha) {
	check(doc, Schemas.registerPartner);
	verifyCaptcha(this, captcha);

	var res = registerPartner(doc);
	if (doc.emailHash === res.invite.emailHash && doc.email && res.invite.email) {
		WlmUtils.verifyEmail(doc.email);
	} else {
		Accounts.sendVerificationEmail(res.userId, doc.email);
	}
};

Meteor.methods({
	checkLogin: function (doc) {
		var user;
		check(doc, {
			login: String,
			password: String
		});
		log.trace(doc);
		user = db.users.findOne({
			$or: [
				{
					'username': doc.login
				}, {
					'emails.address': doc.login
				}
			]
		});
		if (!user) {
			throw new Meteor.Error(400, 'User not found');
		}
		if (user.status === 'blocked') {
			throw new Meteor.Error(490, 'User blocked');
		}
		return user.username;
	},
	updateProfile: function (doc) {
		var updateObj;
		check(doc, Object);
		log.trace(doc);
		updateObj = {};
		if (doc.name != null) {
			updateObj['$set'] = {
				'profile.name': doc.name,
				'profile.vk': doc.vk,
				'profile.skype': doc.skype,
				'profile.passport': doc.passport
			};
		}

		if (doc.email) {
			var user = Meteor.user();
			// add another email
			if (!_.where(user.emails, { address: doc.email }))
				Accounts.addEmail(this.userId, doc.email);
			// check email not exists before add
			//var user = Meteor.user();
			//if (!_.where(user.emails, { address: doc.email })) {
			//	_.extend(updateObj['$addToSet'], {
			//		emails: {
			//			address: doc.email,
			//			verified: false
			//		}
			//	});
			//}
		}

		if (doc.phone) {
			updateObj['$addToSet'] = {
				'profile.phones': {
					number: doc.phone,
					verified: false
				}
			};
			db.users.update(this.userId, updateObj);

			var verificationCode = WLmVerificationCode.create(doc.phone);

			return WLmSms.send({
				to: doc.phone,
				text: verificationCode
			});
		}
		return db.users.update(this.userId, updateObj);
	},
	/**
	 *
	 * @param doc
	 * @returns {{userId: (any|*), invite: (*|{}|any)}}
	 */
	registerPartner: registerPartnerWithVerification,

	recoverPass: function (doc) {
		check(doc, {
			email: String
		});

		var user = Meteor.users.findOne({ emails: { $elemMatch: { address: doc.email } } });

		if (!user) {
			throw new Meteor.Error(400, 'User not found');
		}

		return user.emails[0].address;
	},

	resendVerificationEmail: function () {
		return Accounts.sendVerificationEmail(Meteor.userId());
	},
	removeMyPhone: function () {
		return db.users.update(Meteor.userId(), { $unset: { 'profile.phones': '' } });
	},
	sendVerifyCodePhone: function (doc) {
		check(doc, Schemas.phoneField);
		this.unblock();
		var verificationCode = WLmVerificationCode.create(doc.phone);

		WLmSms.send({
			to: doc.phone,
			text: verificationCode
		});
	},
	checkVerifyCodePhone: function (doc) {
		check(doc, Schemas.verifyPhone);
		this.unblock();
		WLmVerificationCode.checkCode(doc.verificationCode);

		db.users.update({
			_id: Meteor.userId(),
			"profile.phones.number": Meteor.user().profile.phones[0].number
		}, {
			'$set': {
				'profile.phones.$.verified': true
			}
		});

	}
});

