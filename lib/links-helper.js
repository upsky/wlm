/**
 *
 * @param inviteId
 * @returns {string}
 */
Meteor.getInviteLinks = function (inviteId) {
	return Meteor.absoluteUrl() + 'reg/' + inviteId;
};

/**
 *
 * @param inviteId
 * @returns {string}
 */
Meteor.getInviteLinksEmail = function (hash) {
	return Meteor.absoluteUrl() + 'regemail/' + hash;
};

/**
 *
 * @param user
 * @returns {string}
 */
Meteor.getRecoverPassLink = function (user) {

	return Meteor.absoluteUrl() + 'resetpass/' + user._id;
};
