var template = Template.events;

template.onCreated(function () {
	this.subscribe("eventsList");

});
template.onRendered(function () {
	var fc = this.$('.fc');


	this.autorun(function () {
		fc.fullCalendar('refetchEvents');
	});

});
template.helpers({
	options: function () {
		return {
			lang: 'ru',
			events: function (start, end, timezone, callback) {
				callback(db.events.find().fetch());
			}
		};
	}
});
template.events({
	'click [name=createEvent]': function () {
		Modal.show('eventModal');
	}
});
