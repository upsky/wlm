PNotify.prototype.options.styling = 'fontawesome';

recaptchaOnload = function (arg) {
	console.log('recaptcha', arg);
};

Meteor.startup(function () {
	var LANG = 'ru';
	reCAPTCHA.config({
		publickey: Meteor.settings.public.recaptchaPublic,
		hl: LANG,
		http: true
	});

	moment.locale(LANG);

	return TAPi18n.setLanguage(LANG)
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
