Meteor.startup(function () {
	Migrations.migrateTo('latest');

	Meteor.startup(function() {
		reCAPTCHA.config({
			privatekey: Meteor.settings.recaptchaPrivate
		});
	});

	// TODO change buggy tap to something NOT BUGGY!!!
	TAPi18next.setLng('ru');
});


WlmSecurity.excludePublish(/^MeteorToy.*/);
WlmSecurity.excludePublish(/^meteor.*/);
WlmSecurity.excludeMethods(/^MeteorToy.*/);
WlmSecurity.excludeMethods(/^Mongol.*/);
