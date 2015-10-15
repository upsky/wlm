WlmSecurity.addMethods({
	createEvent: {
		roles: 'all'
	},
	updateEvent: {
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
	//console.log(db.invites.find().fetch());
	return db.events.find();
});


Meteor.methods({
	createEvent: function (doc) {
		check(doc, {
			eventName: String,
			start: Date,
			end: Date,
		});

		return WlmEvent.create(doc);
	},
	updateEvent: function (doc) {
		check(doc, {
			_id: String,
			eventName: String,
			start: Date,
			end: Date,
		});

		return WlmEvent.update(doc);
	}
});

