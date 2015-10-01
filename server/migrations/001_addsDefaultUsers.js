Migrations.add({
	version: 1,
	name: 'Adds default users in db.',
	up: function () {
		if (db.users.find({}, {limit: 1}).count() > 0)
			return;

		var rootId = Accounts.createUser({
			username: 'root',
			email: 'root@wlm.ru',
			password: Random.secret()
		});

		db.partners.insert({
			_id: rootId,
			level: 0,
			path: []
		});

		Roles.addUsersToRoles(rootId, 'partner');

		///////////////
		var adminId = Accounts.createUser({
			username: 'sysadmin',
			email: Meteor.settings.sysadminEmail,
			password: Meteor.settings.sysadminPass
		});
		Roles.addUsersToRoles(adminId, 'sysadmin');


		///////////////
		var inviteId = db.invites.insert({
			email: '',
			name: '',
			initiator: rootId,
			status: 'active'
		});

		var partnerId = registerPartner({
			name: 'Partner Partner',
			email: 'partner@wlm.ru',
			newPass: 'partner',
			_id: inviteId,
			emailHash: inviteId
		});

	}
});
