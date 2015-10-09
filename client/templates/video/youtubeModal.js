var currentData = Template.currentData;

Template.youtubeModal.events({
	'click [name=showVideo]': function () {
			Session.set('video', currentData());
			Modal.show('youtubeModalItem');
	},
	'click [name=changeVideo]': function () {
			Session.set('editVideo', currentData());
			if(db.videos.find({name: currentData()}).count() == 0 ) {
				Session.set('route', Router.current().route.getName());
				Router.go('addVideo');
			} else {
				var id = db.videos.findOne({name: currentData()})._id;
				Session.set('route', Router.current().route.getName());
				Router.go('editVideo', {_id: id});
			}
	}
});

Template.youtubeModal.helpers({
	videoName: function () {
		if (db.videos.find({name: currentData()}).count() == 0) {
			return TAPi18n.__('commonText.disabled');
		} else {
			return db.videos.findOne({name: currentData()}).title;		}
	},
	disabled: function () {
		if (db.videos.find({name: currentData()}).count() == 0) {
			return 'disabled';
		} else {
			return '';
		}
	}
});
