Meteor.getInviteLinks = function (inviteId, isQr) {
	return Meteor.absoluteUrl() + 'reg/' + inviteId;
};
