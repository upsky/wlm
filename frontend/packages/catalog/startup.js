
var adminConf = {
	username: 'Admin',
	password: '123'
};

if (Meteor.isServer) {
	if (!Meteor.users.findOne()) {
		var userId = Accounts.createUser({
			username: adminConf.username,
			password: adminConf.password
		});
		Meteor.users.update(userId, {
			$set: {
				'profile.isAdmin': true
			}
		});
		Roles.addUsersToRoles(userId, 'catalogAdmin');
	}
}

if (Meteor.isClient) {
	Meteor.loginWithPassword(adminConf.username, adminConf.password);
}
