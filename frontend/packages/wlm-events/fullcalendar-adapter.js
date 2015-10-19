var FullcalendarAdapter = function () {
	/**
	 *
	 * @param newEvent
	 * @returns {any}
	 */
	function update (newEvent) {
		return Meteor.call('upsertEvent',
			{
				_id: newEvent.id,
				comment: newEvent.comment,
				start: newEvent.start.toDate(),
				end: newEvent.end.toDate(),
				status: newEvent.status
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
				start: event.start,
				end: event.end,
				allDay: false,
				editable: true,
				startEditable: true,
				durationEditable: true,
				status: event.status,
				comment: event.comment,
				className: 'm-events-status-' + event.status,
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
		update(event);
		return;
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
		update(event);
		return;
		if (confirmUpdate(event)) {
			update(event);
		} else {
			revertFunc();
		}
	}

	/**
	 *
	 * @param event
	 */
	function eventClick (event) {
		var start = event.start.unix() * 1000;
		var end = event.end.unix() * 1000;
		Modal.show('eventModal', {
			_id: event.id,
			comment: event.comment,
			start: new Date(start),
			end: new Date(end),
			status: event.status
		});
	}

	/**
	 *
	 * @param date
	 */
	function dayClick (date) {
		var start = date.unix() * 1000;
		var end = start + (10 * 60 * 1000);
		Modal.show('eventModal', {
			start: new Date(start),
			end: new Date(end)
		});
	}


	return {
		prepareArray: prepareArray,
		eventDrop: eventDrop,
		eventResize: eventResize,
		dayClick: dayClick,
		eventClick: eventClick
	}
};

FCAdapter = new FullcalendarAdapter();