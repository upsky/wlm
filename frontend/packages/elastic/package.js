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
		'reactive-var'
	]);
	Npm.depends({
		'elasticsearch': '8.2.0'
	});
	api.addFiles('server.js', 'server');
	api.addFiles('client.js', 'client');
	api.export('Elastic');
});
