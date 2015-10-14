Accounts.onLogin(function (res) {
	var thisUser = res.user;
	var clientIp = res.connection.httpHeaders['x-forwarded-for'];
	var geo = GeoIP.lookup(clientIp);

	var geoUpdate = {
		ip: clientIp,
		date: new Date()
	};
	if (geo) {
		_.extend(geoUpdate, {
			country: geo.country,
			region: geo.region,
			city: geo.city,
			ll: geo.ll
		});
	} else {
		geoUpdate.geo = 'no data';
	}

	var noGeodata = thisUser.geo == undefined ||
		thisUser.geo.date == undefined ||
		typeof thisUser.geo === 'String';

	if (noGeodata) {
		db.users.update(
			{ _id: thisUser._id },
			{
				$set: {
					geo: geoUpdate

				}
			}
		);
	}

	geoUpdate.userId = thisUser._id;
	db.logLogins.insert(geoUpdate);
});
