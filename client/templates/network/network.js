Template.network.rendered = function() {
  return log.trace('network rendered');
};

Template.network.helpers({
  "iamnetwork": function() {
    return 'iam network';
  }
});

Template.network.events({
  "click #network": function(event) {
    return log.trace('click #network');
  }
});
