Meteor.publish('partnerDoc', function () {
	if (!this.userId) return this.ready();

	log.trace('publish partnerDoc');
	return db.partners.find(this.userId);
});

// TODO refactor jaliouslessly
Meteor.publish('networkData', function () {
	if (!this.userId) return this.ready();

	var _ids, currentPartner, currentUser, partners, users;
	log.trace('publish networkData');

	currentUser = this.userId;
	currentPartner = db.partners.findOne(currentUser);

	if (!currentPartner)
		return this.stop();

	partners = db.partners.find({
		path: currentUser,
		level: {
			$gt: currentPartner.level,
			$lte: currentPartner.level + 1
		}
	}, {limit: 50});
	partners.fetch();
	log.trace('publish partners count: ' + partners.count());

	// collect partners ids
	_ids = [];
	partners.forEach(function (partner) {
		_ids.push(partner._id);
	});

	users = db.users.find(
		{_id: {$in: _ids}},
		{fields: {profile: 1}}
	);

	return [partners, users];
});

Meteor.publish('lastInvites', function () {
	if (!this.userId) return this.ready();

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
	if (!this.userId) return this.ready();

	log.trace('publish activeInvites');
	return db.invites.find({
		initiator: this.userId
	});
});

Meteor.methods({
	insertInvite: function (doc) {
		check(this.userId, String);
		check(doc, {
			email: String,
			name: String
		});
		doc.initiator = Meteor.userId();
		doc.status = 'active';
		doc.emailHash = Random.id(30);

		try {
			var inviteId = db.invites.insert(doc);

			if (inviteId) {
				Meteor.call('sendEmail',
					doc.email,
					Meteor.settings.inviteEmail,
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

			return { status: 'ok' };
		} catch (err) {
			log.trace('duplicate email invite ');
			return { error: 'duplicate' }
		}
	},
	networkCounts: function () {
		check(this.userId, String);
		var currentPartner, currentUser, i, result;
		result = [];
		currentUser = this.userId;
		currentPartner = db.partners.findOne(currentUser);
		if (currentPartner) {
			var partnerLevel = currentPartner.level;
			var from = partnerLevel + 1;
			var to = partnerLevel + Meteor.settings.public.networkDeep;

			for (i = from; i <= to; i++) {
				result.push({
					level: i - partnerLevel,
					count: db.partners.find({
						path: currentUser,
						level: i
					}).count()
				});
			}
			return result;
		}
	}
});
