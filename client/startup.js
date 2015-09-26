PNotify.prototype.options.styling = 'fontawesome';

Meteor.startup(function () {
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
