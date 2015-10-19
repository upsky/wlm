WlmSecurity.addMethods({
	upsertEvent: {
		roles: 'all'
	}
});
WlmSecurity.addPublish({
	eventsList: {
		authNotRequired: true,
		roles: 'all'
	}
});

Meteor.publish('eventsList', function () {
	return db.events.find();
});

Meteor.methods({
	upsertEvent: function (doc) {
		check(doc, {
			_id: Match.Optional(String),
			comment: Match.Optional(String),
			start: Date,
			end: Date,
			status: Number
		});
		return WlmEvent.upsert(doc);
	}
});

