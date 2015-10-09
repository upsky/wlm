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

	if (thisUser.status == undefined ||
		thisUser.status.firstLogin == undefined) {
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
