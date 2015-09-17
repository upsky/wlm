Template.settings.rendered = function() {
  return log.trace('settings rendered');
};

Template.settings.helpers({
  settings: {
    blockId: "settings"
  }
});

Template.settings.events({
  "click #settings": function(event) {
    return log.trace('click #settings');
  }
});
