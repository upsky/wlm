
Package.describe({
	name: 'wlm:catalog',
	version: '0.0.1'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.0.1');

	api.use('templating');
	api.use('mongo');
	api.use('less');
	api.use('accounts-password');
	api.use('aldeed:simple-schema');
	api.use('wlm:jquery-ui-drag-drop-resize');
	api.use('twbs:bootstrap');

	api.addFiles([
		'collections.js',
		'startup.js'
	]);

	api.addFiles([
		'catalog.html',
		'catalog-template.js',
		'catalog.less',
		'module.js'
	], 'client');

	api.addFiles([
		'security.js',
		'publish.js',
		'methods.js'
	], 'server');

	api.export(['CatalogConstructor'], 'client');
});