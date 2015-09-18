Template.personalInf.rendered = function() {
  return log.trace('personalInf rendered');
};

Template.personalInf.helpers({
  personalInf: {
    blockId: "personalInf"
  },
  user: function() {
    return Meteor.user();
  }
});

Template.personalInf.events({
  "click #personalInf": function(event) {
    return log.trace('click #personalInf');
  }
});
