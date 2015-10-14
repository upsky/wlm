Template.level.rendered = function() {
  return log.trace('level rendered');
};

Template.level.helpers({
  "iamlevel": function() {
    return 'iam level';
  },

  username: function() {
    var ref = db.users.findOne(this._id);
    return ref && ref.username;
  },
  name: function() {
    var ref = db.users.findOne(this._id);
    return ref && ref.profile ? ref.profile.name : undefined;
  }
});

Template.level.events({
  "click #level": function(event) {
    return log.trace('click #level');
  }
});
