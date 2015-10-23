verificationCodeSchemas = new SimpleSchema({
	type: {
		type: "select",
		options: function () {
			return [
				{ label: "phone", value: "phone" }
			];
		}
	},
	userId: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	phoneNumber: {
		type: String
	},
	code: {
		type: Number
	},
	created: {
		type: Date
	}
});