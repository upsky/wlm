SimpleSchema.RegEx.Phone = /^[0-9]{10}$/;


verificationCodeSchemas = new SimpleSchema({
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	phoneNumber: {
		type: String,
		regEx: SimpleSchema.RegEx.Phone,
		min: 10,
		max: 10
	},
	code: {
		type: String
	},
	used: {
		type: Boolean
	},
	attempt: {
		type: Number
	},
	created: {
		type: Date
	}
});