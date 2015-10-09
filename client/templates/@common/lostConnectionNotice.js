/**
 *
 * @param status
 * @returns {*}
 */
var setStatus = function (status) {
	switch (status) {
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
	return status
};
Meteor.startup(function () {
	var lastStatus = null;

	Deps.autorun(function () {
		var status = Meteor.status().status;

		if (lastStatus && status === 'connected')
			return;

		if (lastStatus === status)
			return;

		lastStatus = setStatus(status);
	})
});

Template.lostConnectionNotice.events({
	'click #reload': function () {
		location.reload();
	}
});


