var FullcalendarAdapter = function () {
	/**
	 *
	 * @param newEvent
	 * @returns {any}
	 */
	function update (newEvent) {
		return Meteor.call('updateEvent',
			{
				_id: newEvent.id,
				name: newEvent.title,
				start: newEvent.start.toDate(),
				end: newEvent.end.toDate()
			}
		);
	}

	/**
	 *
	 * @param event
	 * @returns {boolean}
	 */
	function confirmUpdate (event) {
		if (!confirm("Are you sure about this change?")) {
			return false;
		}
		return true
	}

	/**
	 *
	 * @param events
	 * @returns {Array}
	 */
	function prepareArray (events) {
		var res = [];

		events.forEach(function (event) {
			res.push({
				id: event._id,
				title: event.name,
				start: event.start,
				end: event.end,
				allDay: true,
				editable: true,
				startEditable: true,
				durationEditable: true
			});
		});

		return res;
	}

	/**
	 *
	 * @param event
	 * @param delta
	 * @param revertFunc
	 */
	function eventDrop (event, delta, revertFunc) {
		if (confirmUpdate(event)) {
			update(event);
		} else {
			revertFunc();
		}
	}

	/**
	 *
	 * @param event
	 * @param delta
	 * @param revertFunc
	 */
	function eventResize (event, delta, revertFunc) {
		if (confirmUpdate(event)) {
			update(event);
		} else {
			revertFunc();
		}
	}

	function eventClick () {
		alert('eventClick');
	}


	return {
		prepareArray: prepareArray,
		eventDrop: eventDrop,
		eventResize: eventResize,
		eventClick: eventClick
	}
};

FCAdapter = new FullcalendarAdapter();