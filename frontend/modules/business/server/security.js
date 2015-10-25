WlmSecurity.addMethods({
	insertBusiness: {
		roles: 'all'
	},
	scheduleEdit: {
		roles: 'all'
	},
	'/cfs.images.filerecord/insert': {
		authNotRequired: true,
		roles: 'all'
	},
	'/cfs.images.filerecord/update': {
		authNotRequired: true,
		roles: 'all'
	},
	'logo': {
		authNotRequired: true,
		roles: 'all'
	},
	'/cfs.images.filerecord/remove': {
		authNotRequired: true,
		roles: 'all'
	},
	businessEdit:{
		authNotRequired: true,
		roles: 'businessMan'
	}
});