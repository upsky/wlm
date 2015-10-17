var template = Template.panel;

template.onCreated(function () {
	var panelName = 'panel-' + this.data.blockId;

	this._blockId = this.data.blockId;
	this._hideBox = new ReactiveVar(Meteor.isCordova ? true : false);

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
		var panelName = 'panel-' + Template.instance()._blockId;

		if (hideBox.get())
			hideBox.set(false);
		else
			hideBox.set(true);

		Session.setPersistent(panelName, hideBox.get());
	}
});

