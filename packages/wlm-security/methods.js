_.extend(WlmSecurity, {
	_methods: {},
	_methodFuncs: {},
	_excludeMethods: [],
	addMethods: function (methods) {
		var self = this;
		_.each(methods, function (options, methodName) {
			if (methodName in self._methods)
				throw new Meteor.Error(400, 'duplicate method in methods security: ' + methodName);

			check(options, {
				authNotRequired: Match.Optional(Match.OneOf(undefined, Boolean)),
				roles: Match.OneOf(String, [String]),
				impersonate: Match.Optional(Boolean)
			});

			self._methods[methodName] = options;
			// add to impersonate if needed
			if (options.impersonate) {
				imp = {};
				imp[ methodName ] = 'all';
				Impersonate.addAllowedMethods(imp)
			}
		});
	},

	excludeMethods: function (regEx) {
		this._excludeMethods.push(regEx);
	}
});

Meteor.beforeAllMethods(function () {
	methodName = this._methodName;
	authLog.info('before call method: ' + methodName);
	checkDefaultOptions(Meteor.userId(), WlmSecurity._methods, methodName);
});

//// collect all added methods
//var originalMethods = Meteor.methods;
//Meteor.methods = function (methods) {
//	_.extend(WlmSecurity._methodFuncs, methods);
//	originalMethods.call(this, methods);
//}

// check all methods added to security
var checkMethods = function () {
	var security = _.keys(WlmSecurity._methods);
	var real = _.filter(_.keys(Meteor.server.method_handlers), function (name) {
		// check that its not one of */insert */update or */remove collection methods
		var split = name.split('/');
		return split.length === 1 || (!_.contains(['insert', 'remove', 'update' ], _.last(split)));
	});
	var noReal = _.difference(security, real);
	noReal.forEach(function (method) {
		log.error('method', method, 'added to WlmSecurty.addMethods but is not present');
	});

	var unsecured = _.difference(real, security);
	unsecured.forEach(function (method) {
	});

	var exclude = {};
	unsecured.forEach(function (method) {
		var ex = _.any(WlmSecurity._excludeMethods, function (regExp) { return regExp.test(method); });
		if (ex)
			exclude[method] = {
				authNotRequired: true,
				roles: 'all'
			};
		else
			log.error('method', method, 'is not secured with WlmSecurty.addMethods');
	});
	WlmSecurity.addMethods(exclude);
};
Meteor.startup(function () {
	Meteor.defer(checkMethods);
});