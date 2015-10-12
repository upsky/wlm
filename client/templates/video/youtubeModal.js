var currentData = Template.currentData;

Template.youtubeModal.events({
	'click [name=showVideo]': function () {
		Session.set('video', currentData());
		Modal.show('youtubeModalItem');
	},
	'click [name=changeVideo]': function () {
		Session.set('editVideo', currentData());
		Session.set('route', Router.current().route.getName());
		if (db.videos.find({ _id: currentData() }).count() == 0) {
			Router.go('addVideo');
		} else {
			var blockName = db.videos.findOne({ _id: currentData() })._id;
			Router.go('editVideo', { _id: blockName });
		}
	}
});

Template.youtubeModal.helpers({
	disabled: function () {
		if (db.videos.find({ _id: currentData() }).count() == 0) {
			return 'disabled';
		} else {
			return '';
		}
	}
});