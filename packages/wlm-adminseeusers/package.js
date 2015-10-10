Package.describe({
	name: 'wlm-adminseeusers',
	version: '0.0.1',
	summary: 'Панель поиска и управления пользователями',
	git: '',
	documentation: 'README.md'
});

both = ['server', 'client'];
server = 'server';
client = 'client';

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.use('cutter-paginator',client);
	api.use('iron:router',both);
	api.use('alanning:roles',both);
	api.use('accounts-password',client);
	api.use('templating', client);
	api.use('wlm-security');
	api.use('session');

	api.addFiles([
		'lib.js'
	], both);

	api.addFiles([
		'templates.html',
		'client.js'
	], client);

	api.addFiles([
		'server.js'
	], server);

	api.export('WlmAdminSeeUsers');
});