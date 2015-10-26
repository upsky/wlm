verificationCodeSchemas = new SimpleSchema({
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	phoneNumber: {
		type: String,
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