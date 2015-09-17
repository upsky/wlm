Template.networkLevels.helpers({
  networkLevels: {
    blockId: "networkLevels"
  },
  totalRegs: function() {
    Meteor.call('totalRegs', function(error, result) {
      return Session.set('totalRegs', result);
    });
    return Session.get('totalRegs');
  },
  levels: function() {
    var currentLevel, partners, partnersByLevel, ref;
    currentLevel = (ref = db.partners.findOne(Meteor.userId())) != null ? ref.level : void 0;
    partners = db.partners.find({
      level: {
        $gt: currentLevel
      }
    }).fetch();
    partnersByLevel = [];
    _.each(partners, function(partner) {
      if (!partnersByLevel[partner.level]) {
        partnersByLevel[partner.level] = {
          partners: []
        };
      }
      return partnersByLevel[partner.level].partners.push(partner);
    });
    return partnersByLevel;
  },
  levelsCounts: function() {
    Meteor.call('networkCounts', function(error, result) {
      Session.set('levelsCounts', result);
      return log.trace(result);
    });
    return Session.get('levelsCounts');
  }
});
