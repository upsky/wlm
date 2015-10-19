var template = Template.eventModal;

template.helpers({
	secondaryTitle: function () {
		return moment(this.start).calendar();
	},
	options: function () {
		return [
			{ label: TAPi18n.__('formFields.eventStatus.new'), value: EVENT_STATUS.NEW },
			{ label: TAPi18n.__('formFields.eventStatus.confirmed'), value: EVENT_STATUS.CONFIRMED },
			{ label: TAPi18n.__('formFields.eventStatus.waiting'), value: EVENT_STATUS.WAITING },
			{ label: TAPi18n.__('formFields.eventStatus.notConfirmed'), value: EVENT_STATUS.NOT_CONFIRMED }
		]
	}
});
AutoForm.hooks({
	eventForm: {
		before: {
			method: function (doc) {
				return doc;
			}
		},
		onError: function (type, error) {
		},
		onSuccess: function (type, res) {
			Modal.hide('eventModal');
		},
		onSubmit: function (data) {
		}
	}
});
