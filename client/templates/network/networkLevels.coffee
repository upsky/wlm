Template.networkLevels.helpers
  networkLevels:
    blockId:"networkLevels"
  totalRegs: ()->
    Meteor.call 'totalRegs', (error, result)->
      Session.set 'totalRegs', result
    Session.get 'totalRegs'
  levels: ()->
    currentLevel = db.partners.findOne(Meteor.userId())?.level
    partners = db.partners.find(
      level:
        $gt: currentLevel
    ).fetch()
    partnersByLevel = []
    _.each(partners, (partner)->
      unless partnersByLevel[partner.level]
        partnersByLevel[partner.level] =
          partners:[]
      partnersByLevel[partner.level].partners.push partner
    )
    partnersByLevel
  levelsCounts: ()->
    Meteor.call 'networkCounts', (error, result)->
      Session.set 'levelsCounts', result
      log.trace result
    Session.get 'levelsCounts'
