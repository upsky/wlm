Template.youtubeModal.events({
	'click [name=showVideo]': function () {
			Session.set('video', Template.currentData());
			Modal.show('youtubeModalItem');
	},
	'click [name=changeVideo]': function () {
			//Session.set('currentVideo', Template.currentData());
			Router.go('/videoManager');
	}
});

Template.youtubeModal.helpers({
	videoName: function () {
		if (db.videos.find({name: Template.currentData()}).count() == 0) {
			return 'Тут пока ничего нету';
		} else {
			return db.videos.find({name: Template.currentData()}).fetch()[0].title;		}
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
