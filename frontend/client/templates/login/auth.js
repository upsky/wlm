var currentPassword = undefined;

WlmNotify.define('LOGIN_ERROR', {
	group: 'login',
	type: 'error',
	title: 'errors.loginErrorTitle',
	text: 'errors.unknownError'
});

WlmNotify.define('PASSWORD_INCORRECT', {
	group: 'login',
	type: 'error',
	title: 'errors.loginErrorTitle',
	text: 'errors.loginOrPasswordIncorrect'
});

AutoForm.hooks({
	loginForm: {
		before: {
			method: function (doc) {
				currentPassword = doc.password;
				doc.password = 'fakePass';
				return doc
			}
		},
		onError: function (type, error) {
			console.log(error);
			if (error.error === 490) {
				return Router.go('blocked');
			} else {
				return WlmNotify.create('LOGIN_ERROR');
			}
		},

		onSuccess: function (type, result) {
			if (!result) {
				return;
			}

			var password = currentPassword;
			currentPassword = undefined;
			return Meteor.loginWithPassword(result, password, function (error) {
				if (error) {
					return WlmNotify.create('PASSWORD_INCORRECT');
				} else {
					return Router.go('/');
				}
			});
		}
	}
});

Template.auth.rendered = function () {
	return log.trace('login rendered');
};

Template.auth.onRendered(function () {

});

Template.auth.events({
	"click #login": function () {
		return log.trace('click #login');
	}
});
