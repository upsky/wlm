Package.describe({
	name: 'wlm-sms',
	version: '0.0.1',
	summary: '',
	git: '',
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.use('wlm-security', 'server');
	api.use('aldeed:simple-schema');
	api.use('check');


	api.addFiles([
		'lib/collections.js',
		'lib/schemas.js'
	]);

	api.addFiles([
		'publish.js',
		'wlm-sms.js'
	], 'server');


	api.export('WLmSms', 'server');
});

Package.onTest(function (api) {
});
