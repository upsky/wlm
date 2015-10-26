WlmSecurity.addPublish({
	videos: {
		roles: 'all'
	},
	invite: {
		authNotRequired: true,
		roles: ['partner', 'president']
	},
	inviteEmail: {
		authNotRequired: true,
		roles: ['partner', 'president']
	}
});


Meteor.publish('videos', function () {
	return db.videos.find();
});


Meteor.publish('invite', function (_id) {
	check(_id, Match.Id);
	log.trace('publish invite');
	return db.invites.find(_id, { fields: { emailHash: 0 } });
});

Meteor.publish('inviteEmail', function (_id) {
	check(_id, Match.Id);
	log.trace('publish inviteEmail');
	return db.invites.find({ 'emailHash': _id });
});


Meteor.startup(function () {
	Migrations.migrateTo('latest');

	Meteor.startup(function () {
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
