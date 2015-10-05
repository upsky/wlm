Meteor.publish('usersList', function(params) {
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
      name: String,
      youtubeId: String,
      title: String,
      info: String
    });
  var videoId;
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var url = doc.youtubeId;
  var match = url.match(regExp);
  doc.videoId = match[7];
  return db.videos.insert(doc);
  },
  editVideos: function (doc) {
    check(doc, {
      _id: String,
      name: String,
      youtubeId: String,
      title: String,
      info: String
    });
    var videoId, updateObj = {};
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var url = doc.youtubeId;
    var match = url.match(regExp);
    doc.videoId = match[7];
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
