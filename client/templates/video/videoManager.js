Template.videoManager.helpers({
	videoManager:{
		blockId:'videoManager'
	},
	videos: db.videos.find({})
});

Template.videoManager.events({
	'click [name=addVideo]': function () {
		Router.go('/addVideo');
	}
});
