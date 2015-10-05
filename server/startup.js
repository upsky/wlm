Meteor.startup(function () {
	Migrations.migrateTo('latest');

	Meteor.startup(function() {
		reCAPTCHA.config({
			privatekey: Meteor.settings.recaptchaPrivate
		});
	});
});


WlmSecurity.excludePublish(/^MeteorToy.*/);
WlmSecurity.excludePublish(/^meteor.*/);
WlmSecurity.excludeMethods(/^MeteorToy.*/);
WlmSecurity.excludeMethods(/^Mongol.*/);
