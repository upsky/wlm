Template.youtubeModalItem.helpers({
	videoId: function () {
		if(Session.get('video') != undefined || db.videos.findOne({name: Session.get('video')}) != undefined) {
			return db.videos.findOne({name: Session.get('video')}).videoId;
		} else {
			return "4kYSc64aU1w"
		}
	}
});
