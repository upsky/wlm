/**
 * Created by kriz on 01/10/15.
 */

Meteor.autorun(function () {
	if (!Meteor.userId()) {
		// unset all the sessions
		Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
	}
});