/**
 * Created by kriz on 10/09/15.
 */

Meteor.startup(function () {
	var smtp = Meteor.settings["smtp"];
	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;


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

	var adminId = Accounts.createUser({
		username: 'sysadmin',
		email: Meteor.settings.sysadminEmail,
		password: Meteor.settings.sysadminPass
	});
	Roles.addUsersToRoles(adminId, 'sysadmin');


	var inviteId = db.invites.insert({
		email: '',
		name: '',
		initiator: rootId,
		status: 'active'
	});

	Meteor.call('reg', {
		name: 'Partner Partner',
		email: 'partner@wlm.ru',
		newPass: 'partner',
		_id: inviteId
	});
});