var template = Template.panel;

template.onCreated(function () {
	if (this.data.hideBox) {
		this._hideBox = new ReactiveVar(Meteor.isCordova ? true : false);
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

		if (hideBox.get())
			hideBox.set(false);
		else
			hideBox.set(true);
	}
});

