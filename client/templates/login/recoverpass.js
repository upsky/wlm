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

			WlmNotify.create({
				type: 'error',
				text: 'errors.' + error.reason
			});
		},
		onSuccess: function (type, email) {
			Accounts.forgotPassword({
				email: email
			});
			resetPass.set(true);

			WlmNotify.create({
				type: 'success',
				text: 'messages.emailSend'
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
