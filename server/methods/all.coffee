Meteor.methods
  checkLogin: (doc)->
    check doc,
      login: String
      password: String
    user = db.users.findOne
      $or: [
        "login":doc.login
      ,
        "emails.address":doc.login
      ]
    if !user
      throw new Meteor.Error 400, "User not found"
    if user.status == "blocked"
      throw new Meteor.Error 490, "User blocked"
    user.username
  root: () ->
    if db.users.find().count() == 0
      Accounts.createUser(
        username:'root'
        email:"root@winlevel.ru"
        password: Random.secret()
      )
      _id = db.users.findOne(
        username: "root"
      )._id
      db.partners.insert
        _id:_id
        level:0
        path:[]
      Roles.addUsersToRoles(_id, "partner")
      Accounts.createUser(
        username:'sysadmin'
        email:"latnok@li.ru"
        password: Meteor.settings.sysadminPass
      )
      _id = db.users.findOne(
        username: "sysadmin"
      )._id
      Roles.addUsersToRoles(_id, "sysadmin")

  updateProfile: ()->
    log.trace arguments

