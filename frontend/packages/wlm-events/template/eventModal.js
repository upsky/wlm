var template = Template.eventModal;

template.helpers({
	options: function () {
		return [
			{ label: "EVENT_STATUS.NEW", value: EVENT_STATUS.NEW },
			{ label: "EVENT_STATUS.CONFIRMED", value: EVENT_STATUS.CONFIRMED },
			{ label: "EVENT_STATUS.WAITING", value: EVENT_STATUS.WAITING },
			{ label: "EVENT_STATUS.NOT_CONFIRMED", value: EVENT_STATUS.NOT_CONFIRMED }
		]
	}
});
AutoForm.hooks({
	eventForm: {
		before: {
			method: function (doc) {
				console.log('before', doc);
				return doc;
			}
		},
		onError: function (type, error) {
			console.log('error', arguments);
		},
		onSuccess: function (type, res) {
			Modal.hide('eventModal');
		},
		onSubmit: function (data) {
			console.log('onSubmit', arguments)
		}
	}
});
