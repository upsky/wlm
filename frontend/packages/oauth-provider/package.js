Package.describe({
	name: "wl:oauth-provider",
	summary: "WL OAuth provider",
	git: "",
	version: "0.1.0"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.0");
	api.use([
		'http'
	], 'server');

	api.addFiles('oauth-route.js');

	api.addFiles([
		'oauth.js',
		'oauth.html'
	]);

	api.addFiles([
		'oauth-server.js'
	], 'server');
});