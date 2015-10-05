AutoForm.hooks({
	changePass: {
		onSubmit: function (insertDoc) {
			console.log(insertDoc);

			Accounts.changePassword(insertDoc.oldPass, insertDoc.newPass, function () {
				WlmNotify.create({
					title: 'messages.passwordChanged',
					type: 'success'
				});
			});

			AutoForm.resetForm('changePass');
			return false;
		}
	}
});

Template.changePass.rendered = function () {
	return log.trace('changePass rendered');
};

Template.changePass.helpers({
	changePass: {
		blockId: "changePass"
	}
});
//
//Template.changePass.events({
//	"click #changePass": function (event) {
//		return log.trace('click #changePass');
//	}
//});
