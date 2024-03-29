/**
 * Created by kriz on 01/10/15.
 */

var Notify = function (id) {
	this.id = id;
};
_.extend(Notify.prototype, {
	close: function () {
		WlmNotify.close(this.id);
	}
});

WlmNotify = {
	_groups: {},
	_notify: {},
	_defined: {},
	define: function (name, opt) {
		this._defined[name] = opt;
	},

	create: function (opt) {
		if (typeof opt === 'string') {
			var name = opt;
			opt = this._defined[name];
			if (!opt) {
				console.error('WlmNotify', name, 'not defined');
			}
		}

		// translate
		if (opt.title) {
			var tapParams = opt.titleParams || [];
			tapParams.unshift(opt.title);
			opt.title = TAPi18n.__.apply(TAPi18n, tapParams);
		}

		if (opt.text) {
			tapParams = opt.textParams || [];
			tapParams.unshift(opt.text);
			opt.text = TAPi18n.__.apply(TAPi18n, tapParams);
		}

		var pNotify = new PNotify(opt);

		var id = Random.id();
		this._notify[id] = pNotify;
		var notify = new Notify(id);

		if (opt.group) {
			if (this._groups[opt.group])
				this._groups[opt.group].close()

			this._groups[opt.group] = notify;
		}

		return notify;
	},

	close: function (id) {
		if (this._notify[id]) {
			this._notify[id].remove();
			delete this._notify[id];
		}
	},

	closeAll: function () {
		var self = this;
		_.each(this._notify, function (notify, id) {
			self.close(id);
		});
		this._notify = {};
	}
};

// close all notifications on user change
Meteor.startup(function () {
	PNotify.prototype.options.styling = 'fontawesome';

	Meteor.autorun(function () {
		Meteor.userId(); // make it reactive on user change/login
		WlmNotify.closeAll();
	});
});