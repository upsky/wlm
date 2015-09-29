Meteor.startup(function () {
	if (db.users.find({}, {limit: 1}).count() > 0)
		return;

// create test users
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
	db.users.update(
		{_id: rootId, 'emails.address': 'root@wlm.ru'},
		{$set: {'emails.$.verified': true}}
	);

	///////////////
	var adminId = Accounts.createUser({
		username: 'sysadmin',
		email: Meteor.settings.sysadminEmail,
		password: Meteor.settings.sysadminPass
	});
	Roles.addUsersToRoles(adminId, 'sysadmin');
	db.users.update(
		{_id: adminId, 'emails.address': Meteor.settings.sysadminEmail},
		{$set: {'emails.$.verified': true}}
	);

	///////////////
	var inviteId = db.invites.insert({
		email: '',
		name: '',
		initiator: rootId,
		status: 'active'
	});

	var partnerId = Meteor.call('reg', {
		name: 'Partner Partner',
		email: 'partner@wlm.ru',
		newPass: 'partner',
		_id: inviteId,
		emailHash: inviteId
	});

	db.users.update(
		{_id: partnerId, 'emails.address': 'partner@wlm.ru'},
		{$set: {'emails.$.verified': true}}
	);
})
;