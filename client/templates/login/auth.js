AutoForm.hooks({
	loginForm: {
		before: {
			method: function (doc) {
				Session.set('LoginAttempt', doc.password);
				doc.password = 'fakePass';
				return doc;
			}
		},
		onError: function (type, error) {
			console.log(error);
			if (error.error === 490) {
				return Router.go('blocked');
			} else {
				return WlmNotify.create({
					group: 'login',
					type: 'error',
					title: 'errors.loginErrorTitle',
					text: 'errors.unknownError'
				});
			}
		},
		onSuccess: function (type, result) {
			var password;
			if (result) {
				password = Session.get('LoginAttempt');
				Session.set('LoginAttempt', void 0);
				return Meteor.loginWithPassword(result, password, function (error) {
					if (error) {
						return WlmNotify.create({
							group: 'login',
							type: 'error',
							title: 'errors.loginErrorTitle',
							text: 'errors.loginOrPasswordIncorrect'
						});
					} else {
						return Router.go('/');
					}
				});
			}
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
