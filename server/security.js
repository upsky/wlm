var methodsSecurity;

methodsSecurity = {
	root: {
		authNotRequired: true,
		roles: 'all'
	},
	createUser: {
		roles: 'sysadmin'
	},
	reg: {
		authNotRequired: true,
		roles: 'all'
	},
	checkLogin: {
		authNotRequired: true,
		roles: 'all'
	},
	login: {
		authNotRequired: true,
		roles: 'all'
	},
	logout: {
		authNotRequired: true,
		roles: 'all'
	},
	forgotPassword: {
		authNotRequired: true,
		roles: 'all'
	},
	resetPassword: {
		authNotRequired: true,
		roles: 'all'
	},
	updatePass: {
		authNotRequired: true,
		roles: 'all'
	},
	fakePartners: {
		roles: 'sysadmin'
	},
	impersonate: {
		roles: 'sysadmin,support'
	},
	setRole: {
		roles: 'sysadmin'
	},
	insertInvite: {
		roles: 'partner'
	},
	networkCounts: {
		roles: 'partner'
	},
	invalidateQr: {
		authNotRequired: true,
		roles: 'all'
	},
	checkQr: {
		authNotRequired: true,
		roles: 'all'
	},
	qrApplyCode: {
		authNotRequired: true,
		roles: 'all'
	},
	cordovaAutoLogin: {
		authNotRequired: true,
		roles: 'all'
	},
	cordovaAfterLogout: {
		authNotRequired: true,
		roles: 'all'
	},
	getServerTime: {
		authNotRequired: true,
		roles: 'all'
	},
	recoverPass: {
		authNotRequired: true,
		roles: 'all'
	},
	resetPass: {
		authNotRequired: true,
		roles: 'all'
	},
	qrAuthCode: {
		authNotRequired: false,
		roles: 'all'
	},
	sendEmail: {
		authNotRequired: true,
		roles: 'all'
	},
	updateProfile: {
		roles: 'partner,sysadmin,support'
	},
	totalRegs: {
		roles: 'president,sysadmin'
	}
};

Meteor.beforeAllMethods(function () {
	var methodName, roles;
	methodName = this._methodName;
	authLog.info('before call method: ' + methodName);
	if (!Meteor.userId()) {
		if (!methodsSecurity[methodName].authNotRequired) {
			authLog.warn('authorization required');
			throw new Meteor.Error(403, 'Not authorized');
		}
	} else {
		roles = methodsSecurity[methodName].roles;
		authLog.info('required roles: ' + roles);
		if (roles !== 'all') {
			if (roles.match(/,/)) {
				roles = roles.split(',');
			}
			if (!Roles.userIsInRole(Meteor.userId(), roles)) {
				authLog.warn('required roles check failed');
				throw new Meteor.Error(403, 'No access');
			} else {
				return authLog.info('required roles check success');
			}
		}
	}
});

Impersonate.admins = ['sysadmin', 'support'];
