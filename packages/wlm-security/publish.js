/**
 * Created by kriz on 30/09/15.
 */

_.extend(WlmSecurity, {
	_publish: {},
	_publishFuncs: {},
	addPublish: function (publish) {
		var self = this;
		_.each(publish, function (options, publishName) {
			if (publishName in self._publish)
				throw new Meteor.Error(400, 'duplicate publish in publish security', publishName);

			check(options, {
				authNotRequired: Match.Optional(Match.OneOf(undefined, Boolean)),
				roles: Match.OneOf(String, [String])
			});

			self._publish[publishName] = options;
		});
	}
});

var originalPublish = Meteor.publish;
Meteor.publish = function (pubName, pubFunc) {
	WlmSecurity._publishFuncs[pubName] = pubFunc;
	var wrap = function () {
		try {
			if (checkDefaultOptions(this.userId, WlmSecurity._publish, pubName))
				return pubFunc.apply(this, arguments);
		} catch (e) {
			log.warn('cant publish ', pubName, e.message);
			this.ready();
		}
	};
	originalPublish.call(this, pubName, wrap);
};

// check all methods added to security
Meteor.startup(function () {
	var security = _.keys(WlmSecurity._publish);
	var real = _.keys(WlmSecurity._publishFuncs);
	var noReal = _.difference(security, real);
	noReal.forEach(function (publish) {
		log.error('publish', publish, 'added to WlmSecurty.addMethods but is not present');
	});

	var unsecured = _.difference(real, security);
	unsecured.forEach(function (method) {
		log.error('publish', method, 'is not secured with WlmSecurty.addMethods');
	});

});