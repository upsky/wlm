WlmSecurity.addPublish({
	usersList: {
		roles: 'president'
	}
});

WlmSecurity.addMethods({
	setRole: {
		roles: [ 'sysadmin', 'president' ]
	}
});

Meteor.publish('usersList', function (params) {
	check(params, Object);
	log.trace('publish usersList');
	log.trace(params);
	return db.users.find(params, {
		limit: 10,
		sort: {
			username: 1
		}
	});
});

Meteor.methods({
  setRole: function(_id, role) {
    check(_id, Match.Id);
    check(role, String);
    return Roles.addUsersToRoles(_id, role);
  },
  insertVideos: function (doc) {
    check(doc, {
      _id: String,
      youtubeId: String,
      title: String,
      info: String,
      videoId: String
    });
    return db.videos.insert(doc);
  },
  editVideos: function (doc) {
    var updateObj = {};
    check(doc, {
      _id: String,
      youtubeId: String,
      title: String,
      info: String,
      videoId: String
    });
    updateObj.title = doc.title;
    updateObj.youtubeId = doc.youtubeId;
    updateObj.info = doc.info;
    updateObj.videoId = doc.videoId;
    return db.videos.update(doc._id, updateObj);
  },
  removeVideo: function (id) {
    check(id, String);
    db.videos.remove(id);
  },
  checkVideo: function (doc) {
    var match, video, regExp;
    check(doc, {
      _id: String,
      youtubeId: String,
      title: String,
      info: String
    });
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
