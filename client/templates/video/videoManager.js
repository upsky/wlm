Template.videoManager.helpers({
	videoManager:{
		blockId:'videoManager'
	},
	videos: db.videos.find({})
});

Template.videoManager.events({
	'click [name=addVideo]': function () {
		Router.go('addVideo');
	},
	'click [name=back]': function () {
		history.go(-1);
	}
});

Template.videoManager.onRendered(function () {
	Session.set('editVideo', undefined);
	Session.set('route', undefined);
});