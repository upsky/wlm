Package.describe({
	name: 'wlm-messaging',
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
	api.versionsFrom('1.2.0.2');
	api.use('ecmascript');
	api.use('templating');
	api.use('wlm-module');
	api.use('aldeed:simple-schema');

	api.addFiles('wlm-messaging.js');

	api.addFiles([
		'chat.css',
		'client-chat.html',
		'client-chat.js'
	], 'client');

	api.addFiles([
		'server.js'
	], 'server');

	api.export('WlmMessages');
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('wlm-messaging');
	api.addFiles('wlm-messaging-tests.js');
});
