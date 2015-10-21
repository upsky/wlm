/**
 * Created by kriz on 21/10/15.
 */

// TODO move to lib
verifyCaptcha = function (method, captcha) {
	var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(method.connection.clientAddress, captcha);
	if (!verifyCaptchaResponse.success) {
		console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
		throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
	} else
		console.log('reCAPTCHA ok', captcha, verifyCaptchaResponse);
};
