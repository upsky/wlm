Meteor.methods
  sysadmin: (method, params...) ->
    check method, String
    check params, Match.Any
    ###
    if !Meteor.userId()
      throw new Meteor.Error(400, "Not logged in")
    if !Roles.userIsInRole Meteor.userId(), ["sysadmin"]
      throw new Meteor.Error(400, "Permission failed")
###
    sysadminMethods[method](params...)

sysadminMethods =
  getStats : (_id, name) ->
    check _id, Match.Id
    check name, Match.filledString
    console.log _id, name