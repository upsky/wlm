verificationCodeSchemas = new SimpleSchema({
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	phoneNumber: {
		type: String,
		regEx: /^[0-9]{10}$/,
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