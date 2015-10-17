var Event = function () {

	function create (doc) {
		doc.userId = Meteor.userId();

		return db.events.insert(doc);
	};

	function update (doc) {
		return db.events.update(doc._id, {
			$set: {
				name: doc.name,
				start: doc.start,
				end: doc.end
			}
		});
	};

	return {
		upsert: function (doc) {
			console.log(doc._id);
		}
	}
};

WlmEvent = new Event();