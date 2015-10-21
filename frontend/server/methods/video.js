/**
 * Created by kriz on 21/10/15.
 */

Meteor.publish('videos', function () {
	return db.videos.find();
});

WlmSecurity.addPublish({
	videos: {
		roles: 'all'
	}
});

Meteor.methods({
	insertVideos: function (doc) {
		check(doc, Schemas.videosSchema);

		return db.videos.insert(doc);
	},

	editVideos: function (doc) {
		check(doc, Schemas.videosSchema);

		return db.videos.update(doc._id, { $set: doc });
	},

	removeVideo: function (id) {
		check(id, String);

		db.videos.remove(id);
	},

	checkVideo: function (doc) {
		check(doc, Schemas.videosSchema);

		var match, video, regExp;
		regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		video = db.videos.findOne({ _id: doc._id, title: doc.title });
		if (video) {
			doc.find = true;
		} else {
			if (db.videos.findOne({ _id: doc._id })) {
				throw new Meteor.Error(501, 'errors.videoUsed');
			} else {
				doc.find = false;
			}
		}
		match = doc.youtubeId.match(regExp)[7];
		if (match.length != 11) {
			throw new Meteor.Error(407, 'errors.checkLink');
		} else {
			doc.videoId = match;
			return doc;
		}
	}
});