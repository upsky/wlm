Meteor.publish('partnerDoc', function () {
	log.trace('publish partnerDoc');
	return db.partners.find(this.userId);
});

Meteor.publish('networkData', function () {
	var _ids, currentPartner, currentUser, cursor1, cursor2, partners;
	log.trace('publish networkData');
	currentUser = this.userId;
	currentPartner = db.partners.findOne(currentUser);
	if (currentPartner) {
		cursor1 = db.partners.find({
			path: currentUser,
			level: {
				$gt: currentPartner.level,
				$lte: currentPartner.level + 3
			}
		});
		partners = cursor1.fetch();
		log.trace('publish partners count: ' + partners.length);
		_ids = _.pluck(partners, '_id');
		cursor2 = db.users.find({
			_id: {
				$in: _ids
			}
		});
		return [cursor1, cursor2];
	} else {
		return this.ready();
	}
});

Meteor.publish('lastInvites', function () {
	log.trace('publish lastInvites');
	return db.invites.find({
		initiator: this.userId
	}, {
		sort: {
			used: 1
		},
		limit: 10
	});
});

Meteor.publish('activeInvites', function () {
	log.trace('publish activeInvites');
	return db.invites.find({
		initiator: this.userId
	});
});

Meteor.methods({
	insertInvite: function (doc) {
		check(doc, {
			email: String,
			name: String
		});
		doc.initiator = Meteor.userId();
		doc.status = 'active';
		doc.emailHash = Random.id(30);

		var inviteId = db.invites.insert(doc);


		if (inviteId) {
			Meteor.call('sendEmail',
				doc.email,
				'info@wlm.ru',
				'Приглашение от ' + Meteor.user().profile.name,
				'invitePartner',
				[
					{
						"name": "reglink",
						"content": Meteor.getInviteLinksEmail(doc.emailHash)
					}
				]
			)
		}
	},
	networkCounts: function () {
		var currentPartner, currentUser, i, l, ref, ref1, result;
		result = [];
		currentUser = this.userId;
		currentPartner = db.partners.findOne(currentUser);
		if (currentPartner) {
			for (l = i = ref = currentPartner.level + 4, ref1 = currentPartner.level + Meteor.settings["public"].networkDeep; ref <= ref1 ? i <= ref1 : i >= ref1; l = ref <= ref1 ? ++i : --i) {
				result.push({
					level: l - currentPartner.level,
					count: db.partners.find({
						path: currentUser,
						level: l
					}).count()
				});
			}
			return result;
		}
	}
});
