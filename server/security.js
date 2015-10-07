Impersonate.admins = ['sysadmin', 'support'];

// configure meteor methods
WlmSecurity.addMethods({
	login: {
		authNotRequired: true,
		roles: 'all'
	},
	logout: {
		roles: 'all'
	},
	logoutOtherClients: {
		roles: 'all'
	},
	getNewToken: {
		authNotRequired: true,
		roles: 'all'
	},
	removeOtherTokens: {
		authNotRequired: true,
		roles: 'all'
	},
	configureLoginService: {
		authNotRequired: true,
		roles: 'all'
	}
});

WlmSecurity.addMethods({
	createUser: {
		roles: 'sysadmin'
	},
	registerPartner: {
		authNotRequired: true,
		roles: 'all'
	},
	checkLogin: {
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
	changePassword: {
		roles: 'all'
	},
	impersonate: {
		roles: ['sysadmin', 'support']
	},
	insertInvite: {
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
	recoverPass: {
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
	resendVerificationEmail: {
		roles: 'all'
	},
	verifyEmail: {
		authNotRequired: true,
		roles: 'all'
	},
	updateProfile: {
		roles: ['partner', 'sysadmin', 'support']
	},
	totalRegs: {
		roles: ['president', 'sysadmin']
	},
	impersonate: {
		roles: 'all'
	}
});
