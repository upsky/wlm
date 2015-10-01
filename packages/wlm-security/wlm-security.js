// Write your package code here!

WlmSecurity = {};

checkDefaultOptions = function(userId, options, name) {
	var option = options[name];
	if (!option) {
		log.warn(name, ' not added to WlmSecurity');
		throw new Meteor.Error(403, 'Not authorized');
	}

	if (!userId) {
		if (!option.authNotRequired) {
			authLog.warn('authorization required for', name);
			throw new Meteor.Error(403, 'Not authorized');
		}
	} else {
		authLog.info(name, ' required roles: ' + option.roles);
		if (option.roles !== 'all') {
			if (!Roles.userIsInRole(userId, option.roles)) {
				authLog.warn('required roles check failed on ', name, 'for', userId);
				throw new Meteor.Error(403, 'No access');
			} else {
				authLog.info('required roles check success');
			}
		}
	}
	return true;
}
