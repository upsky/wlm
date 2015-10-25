verificationCodeSchemas = new SimpleSchema({
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	phoneNumber: {
		type: Number,
		min: 10
	},
	code: {
		type: Number
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