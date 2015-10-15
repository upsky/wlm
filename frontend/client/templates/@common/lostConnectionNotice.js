/**
 *
 * @param status
 * @returns {*}
 */
var setStatus = function (status) {
	switch (status) {
		case 'connecting':
			WlmNotify.create({
				group: 'connect-info',
				text: 'connStatus.connecting',
				type: 'info'
			});
			break;
		case 'connected':
			WlmNotify.create({
				group: 'connect-success',
				text: 'connStatus.connected',
				type: 'success'
			});
			break;
		case 'failed':
		case 'waiting':
		case 'offline':
			WlmNotify.create({
				group: 'connect-error',
				text: 'connStatus.offline',
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


