Meteor.publish "partnerDoc", ()->
  log.trace "publish partnerDoc"
  db.partners.find this.userId

Meteor.publish "networkData", ()->
  log.trace "publish networkData"
  currentUser = this.userId
  currentPartner = db.partners.findOne currentUser
  if currentPartner
    cursor1 = db.partners.find
      path: currentUser
      level:
        $gt: currentPartner.level
        $lte: currentPartner.level + Meteor.settings.public.networkDeep
    partners = cursor1.fetch()
    log.trace "publish partners count: " + partners.length
    _ids = _.pluck partners, '_id'
    cursor2 = db.users.find
      _id:
        $in: _ids
    [cursor1, cursor2]
  else
    @ready()

Meteor.publish "activeInvites", ()->
  log.trace "publish activeInvites"
  db.invites.find
    initiator: this.userId

Meteor.methods
  insertInvite: (doc) ->
    check doc,
      email: String
      name: String
    #inivteLink = Meteor.absoluteUrl() + 'invite/' + Random.secret(24)
    doc.initiator = Meteor.userId()
    doc.status = 'active'
    db.invites.insert doc
