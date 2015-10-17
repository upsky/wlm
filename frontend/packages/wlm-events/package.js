Package.describe({
	name: 'wlm-events',
	version: '0.0.1',
	summary: '',
	documentation: 'README.md'
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');

	api.use(['templating'], 'client');

	api.use('rzymek:fullcalendar@2.4.0', 'client');

	api.use('twbs:bootstrap', 'client');
	api.use('tsega:bootstrap3-datetimepicker@=3.1.3_3', 'client');
	api.use('aldeed:autoform', 'client');
	api.use('aldeed:autoform-bs-datetimepicker', 'client');
	api.use('aldeed:template-extension', 'client');


	api.use('wlm-security', 'server');

	api.use('gwendall:simple-schema-i18n');

	api.addFiles([
		'collections.js'
	]);

	api.addFiles([
		'fullcalendar-adapter.js',
		'template/cFullcalendar.html',
		'template/cFullcalendar.js',
		'template/eventModal.html',
		'template/eventModal.js',
	], 'client');

	api.addFiles([
		'wlm-event.js',
		'wlm-events.server.js'
	], 'server');

	api.addFiles([
		'event-schema.js'
	]);


	api.export('db');
});


Package.onTest(function (api) {
	api.use('wlm-events');
	api.addFiles('wlm-events-tests.js');
});
