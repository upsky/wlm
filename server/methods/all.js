/**
 *
 * @param doc
 * @returns {*}
 */
verifyEmail = function (email) {
	check(email, String);

	return db.users.update(
		{'emails.address': email},
		{$set: {'emails.$.verified': true}}
	);
};

Meteor.publish('videos', function () {
	return db.videos.find();
});
WlmSecurity.addPublish({
	videos: {
		roles: 'all'
	},
	invite: {
		authNotRequired: true,
		roles: [ 'partner', 'president' ]
	},
	inviteEmail: {
		authNotRequired: true,
		roles: [ 'partner', 'president' ]
	}
});


Meteor.publish('invite', function (_id) {
	check(_id, Match.Id);
	log.trace('publish invite');
	return db.invites.find(_id);
});

Meteor.publish('inviteEmail', function (_id) {
	check(_id, Match.Id);
	log.trace('publish inviteEmail');
	return db.invites.find({'emailHash': _id});
});

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
		verifyEmail(doc.email);
	} else {
		Accounts.sendVerificationEmail(res.userId, doc.email);
	}
};

Meteor.methods({
	sendEmail: function (to, from, subject, templateName, data) {
		check([to, from, subject, templateName], [String]);
		check(data, Array);

		this.unblock();
		try {
			this.unblock();
			Mandrill.messages.sendTemplate({
				template_name: templateName,
				template_content: [
					{
						name: 'body',
						content: ''
					}
				],
				message: {
					subject: subject,
					from_email: from,
					global_merge_vars: data,
					"merge_vars": [
						{}
					],
					to: [
						{email: to}
					]
				}
			});
		} catch (e) {
			console.log(e);
		}
	},
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

		if (doc.email != null) {
			//TODO Accounts.addEmail(this.userId, doc.email);
			updateObj['$push'] = {
				emails: {
					address: doc.email,
					verified: false
				}
			}
		}

		if (doc.phone != null) {
			updateObj['$addToSet'] = {
				'profile.phones': {
					number: doc.phone,
					verified: false
				}
			};
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

		var user = Meteor.users.findOne({emails: {$elemMatch: {address: doc.email}}});

		if (!user) {
			throw new Meteor.Error(400, 'User not found');
		}

		return user.emails[0].address;
	},

	resendVerificationEmail: function () {
		return Accounts.sendVerificationEmail(Meteor.userId());
	}
});
