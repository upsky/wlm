Meteor.startup(function () {
	Migrations.migrateTo('latest');
});

WlmSecurity.excludePublish(/^MeteorToy.*/);
WlmSecurity.excludePublish(/^meteor.*/);
WlmSecurity.excludeMethods(/^MeteorToy.*/);
WlmSecurity.excludeMethods(/^Mongol.*/);
