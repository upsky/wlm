Package.describe({
	name: 'wlm-security',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	summary: '',
	// URL to the Git repository containing the source code for this package.
	git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.imply('alanning:roles');
	api.imply('gwendall:impersonate');
	api.use('underscore');
	api.use('check');
	api.use('session');
	api.use('alanning:roles');
	api.use('seba:method-hooks');

	api.addFiles([
		'wlm-security.js',
		'methods.js',
		'publish.js'
	], 'server');

	api.addFiles([
		'cleanup-logout.js'
	], 'client');

	api.export('WlmSecurity');
});

Package.onTest(function (api) {
	api.use('tinytest');
	api.use('wlm-security');
	api.addFiles('wlm-security-tests.js');
});
