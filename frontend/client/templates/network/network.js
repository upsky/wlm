Template.network.rendered = function () {
	return log.trace('network rendered');
};

Template.network.helpers({
	"emptyInviteList": function () {
		return !db.invites.find({
			status: {
				$ne: 'qr'
			}
		});
	}
});

Template.network.events({
	"click #network": function (event) {
		return log.trace('click #network');
	}
});
