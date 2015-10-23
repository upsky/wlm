Template.youtubeModalItem.onRendered(function () {
	// hide modal to stop video playing on program background mode
	document.addEventListener('pause', function () {
		Modal.hide('youtubeModalItem');
	});
});

Template.youtubeModalItem.helpers({
	videoId: function () {
		var videoId = Session.get('video');
		var video = videoId ? db.videos.findOne(videoId) : undefined;
		return video ? video.videoId : this.youtubeId;
	},

	videoName: function () {
		var videoId = Session.get('video');
		// TODO place correct video name in template
		var video = false && videoId ? db.videos.findOne(videoId) : undefined;

		return video ? video.title : 'pageTitles.videoManager';
	}
});
