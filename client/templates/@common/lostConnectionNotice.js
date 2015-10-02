Meteor.startup(Deps.autorun.bind(Deps, function () {
	var status = Meteor.status();
	switch (status.status) {
		case 'connecting':
			WlmNotify.create({
				group: 'connect',
				title: 'connStatus.connecting',
				type: 'info'
			});
			break;
		case 'connected':
			WlmNotify.create({
				group: 'connect',
				title: 'connStatus.connected',
				type: 'success'
			});
			break;
		case 'failed':
		case 'waiting':
		case 'offline':
			WlmNotify.create({
				group: 'connect',
				title: 'connStatus.offline',
				hide: false,
				type: 'error'
			});
			break;

	}
}));

Template.lostConnectionNotice.events({
	'click #reload': function () {
		location.reload();
	}
});

