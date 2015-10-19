var template = Template.cFullcalendar;

template.onCreated(function () {
	this.subscribe("eventsList");
	Session.set('fc.currentView', 'agendaWeek');
});
template.onRendered(function () {
	this.$fc = this.$('.fc');
	var self = this;

	this.autorun(function () {
		self.$fc.fullCalendar('refetchEvents');
	});

});

template.helpers({
	options: function () {
		return {
			header: {
				left: '',
				center: 'title',
				right: ''
			},
			lang: 'ru',
			timezone: 'local',
			eventLimit: true,
			defaultView: Session.get('fc.currentView'),
			defaultDate: moment().add(1, 'days'),
			//height: 650,
			contentHeight: 600,
			slotEventOverlap: false,
			scrollTime: moment().format('HH:mm'),
			slotDuration: '00:15',
			minTime: '08:30',
			maxTime: '18:30',
			businessHours: {
				start: '09:00', // a start time (10am in this example)
				end: '18:00', // an end time (6pm in this example)
				dow: [1, 2, 3, 4, 5]
			},
			views: {
				agenda: {
					eventLimit: 6
				}
			},
			dayClick: FCAdapter.dayClick,
			eventDrop: FCAdapter.eventDrop,
			eventClick: FCAdapter.eventClick,
			eventResize: FCAdapter.eventResize,
			eventDragStart: FCAdapter.eventDragStart,
			eventResizeStart: FCAdapter.eventResizeStart,
			events: function (start, end, timezone, callback) {
				var events = FCAdapter.prepareArray(db.events.find().fetch());
				callback(events);

			}
		};
	},
	isCurrentView: function (view) {
		return (Session.get('fc.currentView') === view ? 'active' : '');
	}
});
template.events({
	'click [name=createEvent]': function () {
		Modal.show('eventModal');
	},
	'click [name=changeView]': function (event) {
		Session.set('fc.currentView', event.target.value);
		Template.instance().$fc.fullCalendar('changeView', event.target.value);
	},
	'click [name=doStep]': function (event) {
		Template.instance().$fc.fullCalendar(event.target.value);
	}
});
