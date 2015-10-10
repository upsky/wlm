// Write your package code here!

Meteor.pubSettings = function () {
	var res = Meteor.settings.public;
	var resStr = 'Meteor.settings.public';
	for (var i = 0; i < arguments.length; i++) {
		var prop = arguments[i];
		if (!(prop in res)) {
			var message = prop + ' not found in ' + resStr;
			console.error(message);
			throw new Meteor.Error(404, message);
		}

		resStr += '.' + prop;
		res = res[prop];
	}
	return res;
};