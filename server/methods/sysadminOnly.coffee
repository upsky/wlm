Meteor.publish "usersList", (params)->
  check params, Object
  log.trace "publish usersList"
  log.trace params
  db.users.find(params, {limit:10})

Meteor.methods
  fakePartners: (count = 100) ->
    check count, Number
    Accounts.createUser(
      username:'fakeUser000'
      email: 'fakeUser000@winlevel.ru'
      password: Random.secret()
    )
    _id = db.users.findOne(
      username: 'fakeUser000'
    )._id

    randomUser = db.users.findOne(
      username: 'root'
    )._id
    targetPartner = db.partners.findOne randomUser
    path = targetPartner.path
    path.push randomUser
    db.partners.insert
      _id:_id
      level:targetPartner.level + 1
      path: path
    Roles.addUsersToRoles(_id, "partner")

    for i in [1...count]
      Accounts.createUser(
        username:'fakeUser' + i
        email: 'fakeUser' + i + '@winlevel.ru'
        password: Random.secret()
      )
      _id = db.users.findOne(
        username: 'fakeUser' + i
      )._id

      total = db.partners.find().count()
      randomSkip = Math.floor(Math.random()*total)

      targetPartner = db.partners.findOne({}, {skip:randomSkip})
      path = targetPartner.path
      path.push randomUser
      db.partners.insert
        _id:_id
        level:targetPartner.level + 1
        path: path
      Roles.addUsersToRoles(_id, "partner")
