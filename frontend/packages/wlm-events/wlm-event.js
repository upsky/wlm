var Event = function () {

	/**
	 *
	 * @param doc
	 * @returns {*|any|413|32|{}|483}
	 */
	function create (doc) {
		doc.userId = Meteor.userId();

		return db.events.insert(doc);
	};

	/**
	 *
	 * @param doc
	 * @returns {*}
	 */
	function update (doc) {
		return db.events.update(doc._id, {
			$set: {
				name: doc.name,
				start: doc.start,
				end: doc.end,
				status: doc.status
			}
		});
	};

	return {
		upsert: function (doc) {
			if (typeof doc._id !== "undefined") {
				update(doc);
			} else {
				create(doc);
			}
		}
	}
};

WlmEvent = new Event();