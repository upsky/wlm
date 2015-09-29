PNotify.prototype.options.styling = 'fontawesome';

Meteor.startup(function () {

	Deps.autorun(function () {
		var user = db.users.findOne({_id: Meteor.userId(), 'emails.verified': true});

		if (user)
			Session.set('emailVerified', true);
		else
			Session.set('emailVerified', false);
	});

	moment.locale('ru');

	return TAPi18n.setLanguage('ru')
		.done(function () {
			return _.each(Schemas, function (schema) {
				schema.i18n('formFields');
				return schema;
			});
		})
		.fail(function (error) {
			return log.warn('i18n don\'t loaded: ' + error);
		});
});
