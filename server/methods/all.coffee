Meteor.publish 'invite', (_id)->
  check _id, Match.Id
  log.trace 'publish invite'
  db.invites.find _id

Meteor.methods
  checkLogin: (doc)->
    check doc,
      login: String
      password: String
    log.trace doc
    user = db.users.findOne
      $or: [
        'username':doc.login
      ,
        'emails.address':doc.login
      ]
    if !user
      throw new Meteor.Error 400, 'User not found'
    if user.status == 'blocked'
      throw new Meteor.Error 490, 'User blocked'
    user.username

  updateProfile: (doc)->
    check doc, Object
    log.trace doc
    updateObj = {}
    if doc.name?
      updateObj['$set'] =
        'profile.name':doc.name
        'profile.vk':doc.vk
        'profile.skype':doc.skype
        'profile.passport':doc.passport
    if doc.email?
      updateObj['$push'] =
        emails:
          address: doc.email
          verified: false
    if doc.phone?
      updateObj['$push'] =
        'profile.phones':
          number: doc.phone
          verified: false
    db.users.update(Meteor.userId(), updateObj, {multi:true})

  reg: (doc)->
    check doc,
      name: String
      email: String
      newPass: String
      _id: Match.Id

    invite = db.invites.findOne doc._id

    unless invite
      throw new Meteor.Error 400, 'Invite not found'

    if invite.status == 'used'
      throw new Meteor.Error 400, 'Invite used'

    targetPartner = db.partners.findOne invite.initiator
    unless targetPartner
      throw new Meteor.Error 400, 'Partner not found'

    lastInvite = db.users.findOne({}, {sort: {uin: -1}})
    if lastInvite
      uin = uinGen(Math.floor(lastInvite.uin / 10) + 1)
    if _.isNaN uin
      uin = uinGen(50)

    username = '+' + uin.toString()

    _id = Accounts.createUser(
      username: username
      email: doc.email
      password: doc.newPass
      profile:
        name: doc.name
    )

    path = targetPartner.path
    path.push targetPartner._id
    db.partners.insert
      _id: _id
      level: targetPartner.level + 1
      path: path

    Roles.addUsersToRoles(_id, 'partner')

    db.users.update _id,
      $set:
        uin:uin

    db.invites.update doc._id,
      $set:
        status: 'used'
        userId: _id
        username: username
        used: new Date()

  checkQr: ()-> #create new qr
    qr = db.invites.findOne
      initiator: @userId
      status: 'qr'

    unless qr
      db.invites.insert
        status: 'qr'
        initiator: @userId
        email: ''
        name: ''

  invalidateQr: (_id)->
    check _id, Match.Id
    # invalidate reg qr code if any
    updCount = db.invites.update({ _id: _id, status: 'qr' }, { $set: { status: 'active' } })

    if updCount
      Meteor.call('checkQr');
