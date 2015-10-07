var email, password;
AutoForm.hooks({
	regForm: {
		before: {
			method: function (doc) {
				doc.email = doc.email.toLowerCase();
				doc.emailHash = Router.current().params._id;
				email = doc.email;
				password = doc.newPass;
				return doc;
			}
		},
		onError: function (type, error) {
			WlmNotify.create({
				type: 'error',
				text: error
			});
		},
		onSuccess: function (type, res) {
			Meteor.loginWithPassword(email, password);
			return Router.go('/');
		},

		onSubmit: function (data) {
			var self = this;
			//get the captcha data
			var captcha = grecaptcha.getResponse();

			Meteor.call("registerPartner", data, captcha, function (err) {
				grecaptcha.reset();
				if (err)
					self.done(err);

				self.done();
			});
			return false;
		}
	}
});

Template.reg.rendered = function () {
	log.trace('reg rendered');
	return setTimeout(function () {
		$('.sidebar, .wrapper').addClass('animated fadeInUp');
		return setTimeout(function () {
			return $('.sidebar, .wrapper').removeClass('animated fadeInUp').css('opacity', '1');
		}, 1050);
	}, 50);
};

Template.reg.helpers({
	"iamreg": function () {
		return 'iam reg';
	},
	inviteUsed: function () {
		return this.status === 'used';
	}
});

Template.reg.events({
	"click #reg": function (event) {
		return log.trace('click #reg');
	}
});
