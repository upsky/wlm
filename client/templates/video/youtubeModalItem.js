Template.youtubeModalItem.helpers({
	videoId: function () {
		return db.videos.find({name: Session.get('video')}).fetch()[0].videoId;
	}
});
