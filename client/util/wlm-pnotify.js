/**
 * Created by kriz on 01/10/15.
 */

var Notify = function (id) {
	this.id = id;
}
_.extend(Notify.prototype, {
	close: function () {
		WlmNotify.close(this.id);
	}
});

WlmNotify = {
	_groups: {},
	_notify: {},
	create: function (opt) {
		// translate
		var tapParams = opt.params || [];
		tapParams.unshift(opt.title);
		opt.title = TAPi18n.__.apply(TAPi18n, tapParams);

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
	}
}
