/**
 * Created by kriz on 30/09/15.
 */

Migrations.add({
	version: 3,
	name: 'Adds indexes.',
	up: function () {
		log.trace('making all invite emails lowercase');
		db.invites.find({ email: /[A-Z]/ }, { fields: { _id: 1, email: 1 }}).forEach(function (invite) {
			var email = invite.email.toLowerCase();
			db.invites.update({ _id: invite._id }, { $set: { email: email }});
		});

		// removing duplicate emails invites
		var notUniq = db.invites.aggregate({ $group: { _id: '$email', dupCount: { $sum: 1 } } }, { $match: { dupCount: { $gt: 1 } } });

		log.trace('removing duplicate invites for', notUniq.length, 'emails...');
		var dupCount = 0;
		_.each(notUniq, function (invite) {
			var invites = db.invites
				.find({ email: invite._id }, { fields: { _id: 1, status: 1 } })
				.fetch();

			// remove one used
			// skip one 'used' or if it is last one
			var used = _.findIndex(invites, function (i) { return i.status === 'used' });
			if (~used) // found
				invites.splice(used, 1);
			else
				invites.pop();

			var ids = _.pluck(invites, '_id');
			dupCount += db.invites.remove({ _id: { $in: ids } });
		});
		log.trace('removed ', dupCount, ' duplicates');

		log.trace('creating uniq index on invites.email...');
		db.invites._ensureIndex({ email: 1 }, { unique: 1 });

		log.trace('creating uniq index on partners.path...');
		db.partners._ensureIndex({ path: 1 });
	}
});
