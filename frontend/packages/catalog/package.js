
Package.describe({
	name: 'wlm:catalog',
	version: '0.0.1'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.1');

	api.use('templating');
	api.use('mongo');
	api.use('reactive-var');
	api.use('less');
	api.use('accounts-password');
	api.use('aldeed:simple-schema');
	api.use('wlm:jquery-ui-drag-drop-resize');
	api.use('raix:handlebar-helpers');
	api.use('twbs:bootstrap');
	api.use('iron:router');
	api.use('wlm-security');
	api.use('wlm:elastic');

	api.addFiles([
		'collections.js',
		'startup.js'
	]);

	api.addFiles([
		'catalog.html',
		'catalog-template.js',
		'catalog.less',
		'module.js',
		'route.js' // TODO: remove after test
	], 'client');

	api.addFiles([
		'security.js',
		'publish.js',
		'methods.js'
	], 'server');

	api.export(['CatalogConstructor'], 'client');
});
