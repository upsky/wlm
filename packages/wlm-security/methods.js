_.extend(WlmSecurity, {
	_methods: {},
	_methodFuncs: {},
	addMethods: function (methods) {
		var self = this;
		_.each(methods, function (options, methodName) {
			if (methodName in self._methods)
				throw new Meteor.Error(400, 'duplicate method in methods security: ' + methodName);

			check(options, {
				authNotRequired: Match.Optional(Match.OneOf(undefined, Boolean)),
				roles: Match.OneOf(String, [String])
			});

			self._methods[methodName] = options;
		});
	}
});

Meteor.beforeAllMethods(function () {
	methodName = this._methodName;
	authLog.info('before call method: ' + methodName);
	checkDefaultOptions(Meteor.userId(), WlmSecurity._methods, methodName);
});

// collect all added methods
var originalMethods = Meteor.methods;
Meteor.methods = function (methods) {
	_.extend(WlmSecurity._methodFuncs, methods);
	originalMethods.call(this, methods);
}

// check all methods added to security
Meteor.startup(function () {
	var security = _.keys(WlmSecurity._methods);
	var real = _.keys(WlmSecurity._methodFuncs);
	var noReal = _.difference(security, real);
	noReal.forEach(function (method) {
		log.error('method', method, 'added to WlmSecurty.addMethods but is not present');
	});

	var unsecured = _.difference(real, security);
	unsecured.forEach(function (method) {
		log.error('method', method, 'is not secured with WlmSecurty.addMethods');
	});
});