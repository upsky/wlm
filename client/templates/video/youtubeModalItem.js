Template.youtubeModalItem.helpers({
	videoId: function () {
		return db.videos.findOne({name: Session.get('video')}).videoId;
	}
});
