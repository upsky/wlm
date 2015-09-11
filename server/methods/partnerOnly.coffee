Meteor.publish 'partnerDoc', ()->
  log.trace 'publish partnerDoc'
  db.partners.find this.userId

Meteor.publish 'networkData', ()->
  log.trace 'publish networkData'
  currentUser = this.userId
  currentPartner = db.partners.findOne currentUser
  if currentPartner
    cursor1 = db.partners.find
      path: currentUser
      level:
        $gt: currentPartner.level
        $lte: currentPartner.level + 3
    partners = cursor1.fetch()
    log.trace 'publish partners count: ' + partners.length
    _ids = _.pluck partners, '_id'
    cursor2 = db.users.find
      _id:
        $in: _ids
    [cursor1, cursor2]
  else
    @ready()

Meteor.publish 'lastInvites', ()->
  log.trace 'publish lastInvites'
  db.invites.find
    initiator: this.userId
  ,
    sort:
      used: 1
    limit: 10

Meteor.publish 'activeInvites', ()->
  log.trace 'publish activeInvites'
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
  networkCounts: ()->
    result = []
    currentUser = this.userId
    currentPartner = db.partners.findOne currentUser
    if currentPartner
      for l in [currentPartner.level + 4..currentPartner.level + Meteor.settings.public.networkDeep]
        result.push
          level: l - currentPartner.level
          count: db.partners.find(
            path: currentUser
            level: l
          ).count()
      result