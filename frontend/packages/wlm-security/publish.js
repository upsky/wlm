/**
 * Created by kriz on 30/09/15.
 */

_.extend(WlmSecurity, {
	_publish: {},
	_publishFuncs: {},
	_excludePublish: [],
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
	},
	excludePublish: function (regEx) {
		this._excludePublish.push(regEx);
	}

});

var originalPublish = Meteor.publish;
var pubHandlers = [];
Meteor.publish = function (pubName, pubFunc) {
	return originalPublish.call(this, pubName, function () {
		var self = this;
		var args = arguments;

		try {
			_.each(pubHandlers, function (handler) {
				return handler.call(self, args);
			});
			return pubFunc.apply(self, args);
		} catch (e) {
			this.ready();
		}
	});
};

Meteor.beforeAllPublish = function (func) {
	pubHandlers.push(func);
};

Meteor.beforeAllPublish(function () {
	var publishName = this._name;
	authLog.info('before call publish: ' + publishName);
	checkDefaultOptions(this.userId, WlmSecurity._publish, publishName);
});

// check all methods added to security
var checkPublish = function () {
	var security = _.keys(WlmSecurity._publish);
	var real = _.keys(Meteor.server.publish_handlers);
	var noReal = _.difference(security, real);
	noReal.forEach(function (publish) {
		log.error('publish', publish, 'added to WlmSecurty.addPublish but is not present');
	});

	var exclude = {};
	var unsecured = _.difference(real, security);
	unsecured.forEach(function (publish) {
		var ex = _.any(WlmSecurity._excludePublish, function (regExp) { return regExp.test(publish); });
		if (ex)
			exclude[publish] = {
				authNotRequired: true,
				roles: 'all'
			};
		else
			log.error('publish', publish, 'is not secured with WlmSecurty.addPublish');
	});
	WlmSecurity.addPublish(exclude);
};

Meteor.startup(function () {
	checkPublish();
});