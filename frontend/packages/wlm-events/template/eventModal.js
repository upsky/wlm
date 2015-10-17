var template = Template.eventModal;
//var template = Template.eventModal;
//
AutoForm.hooks({
	eventForm: {
		before: {
			method: function (doc) {
				console.log('before', doc);
				return doc;
			}
		},
		onError: function (type, error) {
			//WlmNotify.create({
			//	type: 'error',
			//	text: error
			//});
			console.log('error', arguments);
		},
		onSuccess: function (type, res) {
			console.log('onSuccess', arguments)
		},
		onSubmit: function (data) {
			console.log('onSubmit', arguments)
		}
	}
});
