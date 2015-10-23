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
	api.use('check');


	api.addFiles([
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
