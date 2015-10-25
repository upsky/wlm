Package.describe({
  name: 'overtonik:statistic',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});
both = ['server', 'client'];
server = 'server';
client = 'client';

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.3');
	api.use('iron:router', both);
	api.use('alanning:roles', both);
	api.use('maazalik:highcharts', client);
	api.use('templating', client);
	api.use('twbs:bootstrap', client);
	api.use('aldeed:autoform', client);
	api.use('rajit:bootstrap3-datepicker', client);
	api.use('aldeed:autoform-bs-datepicker', client);
	api.use('wlm-security');
	api.use('wlm-core');
	api.use('mongo', server);
	api.use('reactive-var', client);
	api.use('check', both);

	api.addFiles([
		'lib.js'
	], both);

	api.addFiles([
		'highcharts.html',
		'statisticFilters.html',
		'statisticFilters.js',
		'client.js',
		'style.css'
	], client);

	api.addFiles([
		'server.js'
	], server);
});

