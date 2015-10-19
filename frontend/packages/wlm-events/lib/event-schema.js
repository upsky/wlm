SimpleSchema.messages({
	"sameTime": 'Дата конца не может быть раньше начала.',
	"minimalTime": 'Событие не может быть меньше 5 минут.',
});

this.eventSchema = new SimpleSchema({
	_id: {
		type: String,
		optional: true
	},
	comment: {
		type: String,
		optional: true,
		max: 1000,
		autoform: {
			afFieldInput: {
				type: "textarea",
				rows: 10,
			}
		}
	},
	start: {
		type: Date,
		autoform: {
			afFieldInput: {
				type: "bootstrap-datetimepicker",
				dateTimePickerOptions: { language: 'ru' }
			}
		}
	},
	end: {
		type: Date,
		autoform: {
			afFieldInput: {
				type: "bootstrap-datetimepicker",
				dateTimePickerOptions: { language: 'ru' }
			}
		},
		custom: function () {
			var startDate = moment(this.field('start').value).unix();
			var endDate = moment(this.value).unix();
			var deltaTime = endDate - startDate;

			if (endDate < startDate)
				return 'sameTime';

			if (deltaTime < (5 * 60))
				return "minimalTime";
		}
	},
	status: {
		type: Number
	}
});
