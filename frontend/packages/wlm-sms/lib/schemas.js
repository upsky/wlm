smsSchemas = new SimpleSchema({
	to: {
		type: String,
		min: 10,
		max: 10
	},
	text: {
		type: String,
		max: 120
	},
	statusCode: {
		type: String,
		optional: true
	},
	created: {
		type: Number,
		optional: true
	}
});