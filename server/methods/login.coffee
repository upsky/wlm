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
    console.log user
    user.username