/**
 * Created by kriz on 30/09/15.
 */

Migrations.add({
	version: 3,
	name: 'Adds indexes.',
	up: function () {
		// removing duplicate emails invites
		var notUniq = db.invites.aggregate({ $group: { _id: '$email', dupCount: { $sum: 1 } } }, { $match: { dupCount: { $gt: 1 } } });

		log.trace('removing duplicate invites for', notUniq.length, 'emails...');
		var dupCount = 0;
		_.each(notUniq, function (invite) {
			var invites = db.invites.find({ email: invite._id }, { fields: { _id: 1, status: 1 } })
				.fetch();

			var ommited = false;
			for (var i = 0; i < invites.length; i++) {
				var invite = invites[i];
				// skip one used or if it is last one
				if (!ommited && (invite.status === 'used' || i === invites.length - 1)) {
					ommited = true;
					continue;
				}

				db.invites.remove({ _id: invite._id });
				dupCount++;
			}
		});
		log.trace('removed ', dupCount, ' duplicates');

		log.trace('creating uniq index on invites.email...');
		db.invites._ensureIndex({ email: 1 }, { unique: 1 });

		log.trace('creating uniq index on partners.path...');
		db.partners._ensureIndex({ path: 1 });
	}
});
