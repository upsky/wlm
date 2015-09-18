AutoForm.hooks({
  changePass: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      log.trace(insertDoc);
      return false;
    }
  }
});

Template.changePass.rendered = function() {
  return log.trace('changePass rendered');
};

Template.changePass.helpers({
  changePass: {
    blockId: "changePass"
  }
});

Template.changePass.events({
  "click #changePass": function(event) {
    return log.trace('click #changePass');
  }
});
