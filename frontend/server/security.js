Impersonate.admins = ['impersonateAccess'];

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
		roles: 'impersonateAccess'
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

	insertVideos: {
		roles: 'videoManager'
	},
	editVideos: {
		roles: 'videoManager'
	},
	removeVideo: {
		roles: 'videoManager'
	},
	checkVideo: {
		roles: 'videoManager'
	},
	getChartData: {
		roles: 'statistic'
	}

});

WlmSecurity.addPublish({
	catalog: {
		authNotRequired: true,
		roles: 'all'
	}
});

WlmSecurity.addMethods({
	createCatalog: {
		roles: 'all'
	},
	createCategory: {
		roles: 'all'
	},
	updateCategory: {
		roles: 'all'
	},
	moveCategory: {
		roles: 'all'
	},
	removeCategory: {
		roles: 'all'
	}
});