// Write your package code here!

WlmModule = {};

WlmModule.Accessor = function (name, rw) {
	if (rw) {
		return function (val) {
			if (arguments.length > 0)
				this[name] = val;
			else
				return this[name];
		}
	} else {
		return function () {
			return this[name];
		}
	}
};