Package.describe({
	name: 'wlm-notify',
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
	api.use('underscore');
	api.use('ecmascript');
	api.use('kidovate:pnotify');
	api.addFiles('pnotify.custom.css');
	api.addFiles('wlm-pnotify.js', 'client');

	api.export('WlmNotify', 'client');
});

Package.onTest(function (api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('wlm-notify');
	api.addFiles('wlm-notify-tests.js');
});
