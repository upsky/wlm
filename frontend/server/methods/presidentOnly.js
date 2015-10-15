Meteor.methods({
  totalRegs: function() {
    return db.partners.find().count();
  }
});
