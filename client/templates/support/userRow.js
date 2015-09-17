Template.userRow.rendered = function() {
  return log.trace('userRow rendered');
};

Template.userRow.helpers({
  "iamuserRow": function() {
    return 'iam userRow';
  }
});

Template.userRow.events({
  "click #userRow": function(event) {
    return log.trace('click #userRow');
  },
  "click .btn-impersonate": function(event) {}
});
