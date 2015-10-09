var template = Template.panel;

template.onCreated(function () {
	if (!this.data.hideBox) {
		this._hideBox = new ReactiveVar(false);
	} else {
		this._hideBox = new ReactiveVar(this.data.hideBox);
	}

	this._showToggleBoxBtn = (!this._hideBox.get() ? false : true);
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
	'click [name="toggleBox"]': function () {
		var hideBox = Template.instance()._hideBox;

		if (hideBox.get())
			hideBox.set(false);
		else
			hideBox.set(true);
	}
});

