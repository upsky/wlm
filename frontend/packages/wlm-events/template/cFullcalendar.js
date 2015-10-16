var template = Template.cFullcalendar;

template.onCreated(function () {
	this.subscribe("eventsList");
	Session.set('fc.currentView', 'month');
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
			eventLimit: true,
			defaultDate: moment().add(50, 'days'),
			views: {
				agenda: {
					eventLimit: 6
				}
			},
			eventDrop: FCAdapter.eventDrop,
			eventResize: FCAdapter.eventResize,
			eventClick: FCAdapter.eventClick,
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
