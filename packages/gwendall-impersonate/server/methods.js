/**
 * Created by kriz on 24/09/15.
 */

var originalMethods = Meteor.methods;

Meteor.methods = function (methods) {
	var checkedMethods = _.mapObject(methods, function (method) {
		return function () {
			// save impersonation to current fiber to make it available anywhere inside method
			if (this.connection.impersonate)
				Fiber.current().impersonate = this.connection.impersonate;
			method.apply(this, arguments);
		}
	});
	originalMethods.call(Meteor, checkedMethods);
};

// update collection prototypes
var proto = Meteor.Collection.prototype;

['update', 'upsert', 'insert', 'remove'].forEach(function (methodName) {
	var origMethod = origCollection[methodName] = proto[methodName];
	proto[methodName] = function () {
		// check impersonation here
		var impersonate = Fiber.current().impersonate;
		if (impersonate) {
			var message = 'trying to call Collection.' + methodName + ' while impersonation';
			console.log(message);
			throw new Meteor.Error(404, message);
		}
		return origMethod.apply(this, arguments);
	}
});