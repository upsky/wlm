Template.networkLevels.onCreated(function () {
	Meteor.call('networkCounts', function (error, result) {
		Session.set('levelsCounts', result);
		return log.trace(result);
	});
	if (Roles.userIsInRole(Meteor.userId(), [ 'president' ])) {
		Meteor.call('totalRegs', function (error, result) {
			return Session.set('totalRegs', result);
		});
	}
});

Template.networkLevels.helpers({
	networkLevels: {
		blockId: "networkLevels"
	},

	totalRegs: function () {
		return Session.get('totalRegs');
	},

	levels: function () {
		var ownPartner = db.partners.findOne(Meteor.userId());
		var levelsCount = Session.get('levelsCounts') || [];

		if (!ownPartner)
			return;

		var currentLevel = ownPartner.level;
		var partners = db.partners.find(
			{ level: { $gt: currentLevel } },
			{ sort: { level: 1 } }
		).fetch();
		partners = _.groupBy(partners, 'level');

		return _.map(levelsCount, function (netLevel) {
			netLevel.partners = partners[ netLevel.level + currentLevel ];
			return netLevel;
		});
	}
});
