Meteor.getInviteLinks = function (inviteId, isQr) {
	return Meteor.absoluteUrl() + 'reg/' + inviteId;
};
Meteor.getRecoverPassLink = function (user) {

	return Meteor.absoluteUrl() + 'resetpass/' + user._id;
};
