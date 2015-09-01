Meteor.publish "networkData", ()->
  log.trace "publish networkData"
  currentUser = this.userId
  cursor1 = db.partners.find
    _id: currentUser
  currentPartner = cursor1.fetch()[0]
  if currentPartner
    cursor2 = db.partners.find
      path: currentUser
      level:
        $gt: currentPartner.level
        $lte: currentPartner.level + Meteor.settings.networkDeep
    partners = cursor2.fetch()
    _ids = _.pluck partners, '_id'
    cursor3 = db.users.find
      _id:
        $in: _ids
    [cursor1, cursor2, cursor3]
  else
    @ready()

Meteor.publish "activeInvites", ()->
  log.trace "publish activeInvites"
  db.invites.find
    initiator: this.userId

Meteor.methods
  invite: () ->
