Meteor.startup(function () {
	Migrations.migrateTo('latest');
});

WlmSecurity.excludePublish(/^MeteorToy.*/);
WlmSecurity.excludeMethods(/^MeteorToy.*/);
WlmSecurity.excludeMethods(/^Mongol.*/);
