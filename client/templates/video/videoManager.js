Template.videoManager.helpers({
	videoManager:{
		blockId:'videoManager'
	},
	videos: db.videos.find({})
});

Template.videoManager.events({
	'click [name=addVideo]': function () {
		Router.go('addVideo');
	}
});

Template.videoManager.onRendered(function () {
	Session.set('route', undefined);
})
