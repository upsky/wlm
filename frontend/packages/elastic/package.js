Package.describe({
	name: 'wlm:elastic',
	version: '0.0.1'
});

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.use([
		'check',
		'ecmascript',
		'mongo',
		'reactive-var',
		'matb33:collection-hooks'
	]);
	Npm.depends({
		'elasticsearch': '8.2.0',
		'object-assign': '4.0.1'
	});
	api.addFiles('server.js', 'server');
	api.addFiles('client.js', 'client');
	api.export('Elastic');
});
