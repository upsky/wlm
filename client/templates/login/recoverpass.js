var template = Template.recoverpass;

var resetPass = new ReactiveVar(false);
var currentEmail = new ReactiveVar('');
template.onRendered(function () {


});

template.events({});

AutoForm.hooks({
	recoverPassForm: {
		before: {
			method: function (doc) {
				currentEmail.set(doc.email);
				return doc;
			}
		},
		onError: function (type, error) {

			return new PNotify({
				type: 'error',
				text: TAPi18n.__('errors.' + error.reason)
			});
		},
		onSuccess: function (type, email) {
			Accounts.forgotPassword({
				email: email
			});
			resetPass.set(true);

			return new PNotify({
				type: 'success',
				text: TAPi18n.__('messages.emailSend')
			});
		}
	}
});

template.rendered = function () {
	resetPass.set(false);
	return log.trace('login rendered');
};

template.helpers({
	"resetPass": function () {
		return resetPass.get();
	},
	"currentEmail": function () {
		return currentEmail.get();
	},
});

template.events({
	"click #login": function () {
		return log.trace('click #login');
	},
	"click [name=loginInstructionsShow]": function () {
		Modal.show('loginInstructionsModal');
	}
});
