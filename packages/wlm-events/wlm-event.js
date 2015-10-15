var Event = function () {
	return {
		create: function (doc) {
			doc.userId = Meteor.userId();

			return db.events.insert(doc);
		},
		update: function (doc) {
			return {};
		},
		/**
		 *
		 * @param businessId
		 * @returns {Array}
		 */
		list: function (businessId) {
			return [];
		}
	}
};

WlmEvent = new Event();