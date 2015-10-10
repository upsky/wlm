Accounts.onLogin(function (res) {
	var thisUser = res.user;
	var clientIp = res.connection.httpHeaders['x-forwarded-for'];
	var geo = GeoIP.lookup(clientIp);

	var geoUpdate = {
		ip: clientIp,
		createdAt: new Date()
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

	var noGeodata = thisUser.status == undefined ||
		thisUser.status.firstLogin == undefined ||
		typeof thisUser.status.geo === 'String';

	if (noGeodata) {
		db.users.update(
			{ _id: thisUser._id },
			{
				$set: {
					status: {
						geo: geoUpdate,
						firstLogin: new Date()
					}
				}
			}
		);
	}

	geoUpdate.userId = thisUser._id;
	db.logLogins.insert(geoUpdate);
});
