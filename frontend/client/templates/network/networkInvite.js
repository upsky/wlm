Session.set('resetCaptcha', false);

Template.networkInvite.helpers({
	networkInvite: {
		blockId: "networkInvite"
	}
});

AutoForm.hooks({
	inviteForm: {
		onSubmit: function (data) {
			var self = this;
			//get the captcha data
			var captcha = grecaptcha.getResponse();

			Meteor.call("createInvite", data, captcha, function (err) {
				grecaptcha.reset();
				if (err)
					self.done(err);

				self.done();
			});
			return false;
		}
	}
});