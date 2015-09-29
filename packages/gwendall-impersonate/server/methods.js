/**
 * Created by kriz on 24/09/15.
 */

var Fiber = Npm.require('fibers');

var checkImpersonation = function (impersonate, methodName) {
	var roles = Impersonate.allowedMethods[methodName];
	var forAll = roles === 'all';
	var isInRole = !_.isEmpty(roles) && Roles.isInRole(impersonate.toUser, roles);
	if (!forAll && !isInRole)
		throw new Meteor.Error(403, 'method not allowed while impersonation', methodName);
};

Meteor.beforeAllMethods(function () {
	// save impersonation to current fiber to make it available anywhere inside method
	if (this.connection.impersonate) {
		var impersonate = Fiber.current.impersonate = this.connection.impersonate;

		checkImpersonation(impersonate, this._methodName);
	}

	// check impersonation for methods here
});

// update collection prototypes
var proto = Meteor.Collection.prototype;

['update', 'upsert', 'insert', 'remove'].forEach(function (methodName) {
	var origMethod = proto[methodName];
	proto[methodName] = function () {
		// check impersonation here
		var impersonate = Fiber.current.impersonate;
		if (impersonate) {
			checkImpersonation(impersonate, this._name + methodName);
		}
		return origMethod.apply(this, arguments);
	}
});