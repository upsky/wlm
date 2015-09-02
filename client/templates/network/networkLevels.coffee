Template.networkLevels.helpers
  networkLevels:
    blockId:"networkLevels"
  levels: ()->
    currentLevel = db.partners.findOne(Meteor.userId()).level
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
