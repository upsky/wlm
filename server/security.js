Impersonate.admins = ['sysadmin', 'support'];

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
		roles: Impersonate.admins
	}
});
