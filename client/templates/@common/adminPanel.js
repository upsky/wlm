Template.adminPanel.rendered = function() {
	return log.trace('AdminPanel rendered');
};

Template.adminPanel.helpers({
	adminPanel: {
		blockId: "adminFunctions"
	}
});

Template.adminPanelButton.helpers({
	buttonText:function(){
		return 'buttons.' + this.text;
	}
});