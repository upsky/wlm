var currentData = Template.currentData;

Template.youtubeModal.events({
	'click [name=showVideo]': function () {
		Session.set('video', currentData());
		Modal.show('youtubeModalItem');
	},
	'click [name=changeVideo]': function () {
		Session.set('editVideo', currentData());
		if (!db.videos.findOne({ _id: currentData() })) {
			Router.go('addVideo');
		} else {
			Router.go('editVideo', { _id: currentData() });
		}
	}
});

Template.youtubeModal.helpers({
	disabled: function () {
		if (!db.videos.findOne({ _id: currentData() })) {
			return 'disabled';
		} else {
			return '';
		}
	}
});