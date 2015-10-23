
recaptchaOnload = function (arg) {
	console.log('recaptcha', arg);
};

Meteor.startup(function () {
	var LANG = 'ru';
	reCAPTCHA.config({
		publickey: Meteor.pubSettings('recaptchaPublic'),
		hl: LANG,
		http: true
	});

	moment.locale(LANG);

	// in 1.2 it stop loading project-tap.i18n
	_.extend(TAPi18n.conf, {
		cdn_path: '/i18n',
		"supported_languages": ["ru"],
		"i18n_files_route": "/i18n"
	});
	TAPi18n.setLanguage(LANG)
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
