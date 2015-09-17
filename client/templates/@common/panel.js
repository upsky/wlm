Template.panel.rendered = function() {
  return log.trace('panel rendered');
};

Template.panel.helpers({
  iampanel: function() {
    return log.trace(this);
  },
  blockTitle: function() {
    log.trace(this);
    return "blockTitles." + this.blockId;
  }
});

Template.panel.events({
  "click #panel": function(event) {
    return log.trace('click #panel');
  }
});
