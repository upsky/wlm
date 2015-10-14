var template = Template.panel;

template.onCreated(function () {
	var panelName = 'pnael-' + this.data.blockId;

	this._blockId = this.data.blockId;
	this._hideBox = new ReactiveVar(Meteor.isCordova ? true : false);

	console.log('wwwww', Session.get(panelName));

	if (typeof Session.get(panelName) !== "undefined") {
		this._hideBox.set(Session.get(panelName));
	}


	if (this.data.hideBox) {
		this._showToggleBoxBtn = true;
	} else {
		this._showToggleBoxBtn = false;
	}


});

template.helpers({
	blockTitle: function () {
		log.trace(this);
		return "blockTitles." + this.blockId;
	},
	showToggleBoxBtn: function () {
		return Template.instance()._showToggleBoxBtn;
	},
	hideBox: function () {
		return Template.instance()._hideBox.get();
	}
});

template.events({
	'click .toggle-box': function () {
		var hideBox = Template.instance()._hideBox;
		var panelName = 'pnael-' + Template.instance()._blockId;

		if (hideBox.get())
			hideBox.set(false);
		else
			hideBox.set(true);

		Session.setPersistent(panelName, hideBox.get());
	}
});

