Meteor.publish('invite', function (_id) {
	check(_id, Match.Id);
	log.trace('publish invite');
	return db.invites.find(_id);
});

Meteor.methods({
	sendEmail: function (to, from, subject, text) {
		check([to, from, subject, text], [String]);
		this.unblock();
		console.log('sendEmail');
		Email.send({
			to: to,
			from: from,
			subject: subject,
			text: text
		});
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
			updateObj['$push'] = {
				emails: {
					address: doc.email,
					verified: false
				}
			};
		}
		if (doc.phone != null) {
			updateObj['$push'] = {
				'profile.phones': {
					number: doc.phone,
					verified: false
				}
			};
		}
		return db.users.update(Meteor.userId(), updateObj, {
			multi: true
		});
	},
	reg: function (doc) {
		var _id, invite, lastInvite, path, targetPartner, uin, username;
		check(doc, {
			name: String,
			email: String,
			newPass: String,
			_id: Match.Id
		});
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
		lastInvite = db.users.findOne({}, {
			sort: {
				uin: -1
			}
		});
		if (lastInvite) {
			uin = uinGen(Math.floor(lastInvite.uin / 10) + 1);
		}
		if (_.isNaN(uin)) {
			uin = uinGen(50);
		}
		username = '+' + uin.toString();
		_id = Accounts.createUser({
			username: username,
			email: doc.email,
			password: doc.newPass,
			profile: {
				name: doc.name
			}
		});
		path = targetPartner.path;
		path.push(targetPartner._id);
		db.partners.insert({
			_id: _id,
			level: targetPartner.level + 1,
			path: path
		});
		Roles.addUsersToRoles(_id, 'partner');
		db.users.update(_id, {
			$set: {
				uin: uin
			}
		});
		return db.invites.update(doc._id, {
			$set: {
				status: 'used',
				userId: _id,
				username: username,
				used: new Date()
			}
		});
	}
});
