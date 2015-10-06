Template.youtubeModal.events({
	'click [name=showVideo]': function () {
			Session.set('video', Template.currentData());
			Modal.show('youtubeModalItem');
	},
	'click [name=changeVideo]': function () {
			Router.go('/admin/video/videoManager');
	}
});

Template.youtubeModal.helpers({
	videoName: function () {
		if (db.videos.find({name: Template.currentData()}).count() == 0) {
			return TAPi18n.__('commonText.disabled');
		} else {
			return db.videos.findOne({name: Template.currentData()}).title;		}
	},
	currentName: function () {
		return Template.currentData();
	},
	disabled: function () {
		if (db.videos.find({name: Template.currentData()}).count() == 0) {
			return 'disabled';
		} else {
			return '';
		}
	}
});
