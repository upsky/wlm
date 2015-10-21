/**
 * Created by kriz on 21/10/15.
 */

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
	/**
	 *
	 * @param doc
	 * @returns {{userId: (any|*), invite: (*|{}|any)}}
	 */
	registerPartner: registerPartnerWithVerification
});


Meteor.publish('invite', function (_id) {
	check(_id, Match.Id);
	log.trace('publish invite');
	return db.invites.find(_id);
});

Meteor.publish('inviteEmail', function (_id) {
	check(_id, Match.Id);
	log.trace('publish inviteEmail');
	return db.invites.find({ 'emailHash': _id });
});

WlmSecurity.addPublish({
	videos: {
		roles: 'all'
	},
	invite: {
		authNotRequired: true,
		roles: ['partner', 'president']
	},
	inviteEmail: {
		authNotRequired: true,
		roles: ['partner', 'president']
	}
});
