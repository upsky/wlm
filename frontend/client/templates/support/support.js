Template.support.rendered = function() {
  return log.trace('support rendered');
};

Template.support.helpers({
  "iamsupport": function() {
    return 'iam support';
  }
});

Template.support.events({
  "click #support": function(event) {
    return log.trace('click #support');
  }
});
