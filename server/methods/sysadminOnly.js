WlmSecurity.addPublish({
	usersList: {
		roles: 'president'
	}
})

WlmSecurity.addMethods({
	setRole: {
		roles: [ 'sysadmin', 'president' ]
	}
})

Meteor.publish('usersList', function (params) {
	check(params, Object);
	log.trace('publish usersList');
	log.trace(params);
	return db.users.find(params, {
		limit: 10,
		sort: {
			username: 1
		}
	});
});

Meteor.methods({
	setRole: function (_id, role) {
		check(_id, Match.Id);
		check(role, String);
		return Roles.addUsersToRoles(_id, role);
	}
});
