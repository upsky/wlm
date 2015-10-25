Package.describe({
	name: 'wlm-verification-code',
	version: '0.0.1',
	summary: '',
	git: '',
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.use('wlm-security', 'server');

	api.use('random');
	api.use('check');
	api.use('aldeed:simple-schema');


	api.addFiles([
		'lib/schemas.js',
		'lib/collections.js'
	]);

	api.addFiles([
		'publish.js',
		'wlm-v-c.js'
	], 'server');


	api.export('WLmVerificationCode', 'server');
});

Package.onTest(function (api) {
});
