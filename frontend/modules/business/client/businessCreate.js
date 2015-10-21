Template.businessCreate.events({
	'click [name=back]': function() {
		Modal.hide();
	}
});

AutoForm.hooks({
 	insertBusinessForm: {
 		onError: function (type, error) {
 			console.log(error);
 		},
 		onSuccess: function (type, result) {
 			Modal.hide();
 			Router.go('business');
 		}
 	}
});