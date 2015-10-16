var Event = function () {
	return {
		create: function (doc) {
			doc.userId = Meteor.userId();

			return db.events.insert(doc);
		},
		update: function (doc) {
			return db.events.update(doc._id, {
				$set: {
					name: doc.name,
					start: doc.start,
					end: doc.end
				}
			});
		}
	}
};

WlmEvent = new Event();