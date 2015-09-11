Meteor.publish 'usersList', (params)->
  check params, Object
  log.trace 'publish usersList'
  log.trace params
  db.users.find(params, {limit:10, sort:{username:1}})

Meteor.methods
  setRole: (_id, role) ->
    check _id, Match.Id
    check role, String
    Roles.addUsersToRoles _id, role