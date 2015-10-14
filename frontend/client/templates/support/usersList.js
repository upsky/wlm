Template.usersList.onCreated(function() {
  return this.subscribe("usersList", {});
});

Template.usersList.rendered = function() {
  return log.trace('usersList rendered');
};

Template.usersList.helpers({
  "iamusersList": function() {
    return 'iam usersList';
  },
  usersList: function() {
    return {
      blockId: 'usersList'
    };
  },
  users: function() {
    var a;
    log.trace("users helper");
    a = db.users.find({
      _id: {
        $ne: Meteor.userId()
      }
    });
    return a;
  }
});

Template.usersList.events({
  "click #usersList": function(event) {
    return log.trace('click #usersList');
  }
});
