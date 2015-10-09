Template.youtubeModalItem.helpers({
	videoId: function () {
		if(Session.get('video') != undefined || db.videos.findOne({name: Session.get('video')}) != undefined) {
			return db.videos.findOne({name: Session.get('video')}).videoId;
		} else {
			this.isNoVideo = true;
			return db.videos.findOne({ name: 'videoManagerInstruction' }).videoId;
		}
	},
	videoData: function () {
		var videoName = Session.get('video');
		if (!videoName) return;

		var video = db.videos.findOne({ name: videoName });
		if (video) {
			video.isFind = true;
		} else {
			video = db.videos.findOne({ name: 'videoManagerInstruction' });
			if (!video) {
				video = {};
			}
			video.isFind = false;
		}
		video.findName = videoName;
		return video;
	},
	isEdit: function () {
		return (Roles.userIsInRole(Meteor.user(), 'videoManager'));
	}
});

Template.youtubeModalItem.onRendered(function () {
	console.log(db.videos.findOne({ name: 'videoManagerInstruction' }));
})
