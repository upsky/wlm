Meteor.methods
  totalRegs: () ->
    db.partners.find().count()