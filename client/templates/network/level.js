Template.level.rendered = function() {
  return log.trace('level rendered');
};

Template.level.helpers({
  "iamlevel": function() {
    return 'iam level';
  },
  levelNum: function() {
    var currentLevel;
    currentLevel = db.partners.findOne(Meteor.userId()).level;
    return this.partners[0].level - currentLevel;
  },
  partnersCount: function() {
    return this.partners.length;
  },
  username: function() {
    var ref;
    return (ref = db.users.findOne(this._id)) != null ? ref.username : void 0;
  },
  name: function() {
    var ref, ref1;
    return (ref = db.users.findOne(this._id)) != null ? (ref1 = ref.profile) != null ? ref1.name : void 0 : void 0;
  }
});

Template.level.events({
  "click #level": function(event) {
    return log.trace('click #level');
  }
});
