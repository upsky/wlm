/**
 * Created by overtonik on 08.10.15.
 */
Migrations.add({
	version: 4,
	name: 'update Default Users Staus Geo',
	up: function () {
		db.users.find({ "status.geo.geo": 'no data' }).forEach(function (user) {
			db.users.update({ _id: user._id }, { $unset: { status: '' } });
		});
		db.users._ensureIndex({ "geo.country": 1 });
	}
});