WlmSecurity.addPublish({
	usersList: {
		roles: 'president'
	}
})

WlmSecurity.addMethods({
	setRole: {
		roles: [ 'sysadmin', 'president' ]
	}
})

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
    var videoId, regExp, match;
    check(doc, {
      name: String,
      youtubeId: String,
      title: String,
      info: String
    });
  regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  match = doc.youtubeId.match(regExp)[7];
  if (match.length != 11) {
    throw new Meteor.Error(407, 'Not correct reference');
  } else {
    doc.videoId = match;
  }
  return db.videos.insert(doc);
  },
  editVideos: function (doc) {
    var videoId, regExp, match, updateObj = {};
    check(doc, {
      _id: String,
      name: String,
      youtubeId: String,
      title: String,
      info: String
    });
    regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    match = doc.youtubeId.match(regExp)[7];
    if (match.length != 11) {
      throw new Meteor.Error(407, 'Not correct reference');
    } else {
      doc.videoId = match;
    }
    updateObj.title = doc.title;
    updateObj.name = doc.name;
    updateObj.youtubeId = doc.youtubeId;
    updateObj.info = doc.info;
    updateObj.videoId = doc.videoId;
    return db.videos.update(doc._id, updateObj);
  },
  removeVideo: function (id) {
    check(id, String);
    db.videos.remove(id);
  }
});
