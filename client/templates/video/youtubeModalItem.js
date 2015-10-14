Template.youtubeModalItem.helpers({
	videoId: function () {
		if (Session.get('video') != undefined || db.videos.findOne({ _id: Session.get('video') }) != undefined) {
			return db.videos.findOne({ _id: Session.get('video') }).videoId;
		}
	}
});
