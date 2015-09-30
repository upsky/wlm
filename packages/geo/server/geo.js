Accounts.onLogin (function(res){
	var thisUser = res.user;
	var nowIp = res.connection.clientAddress;
	var geo = GeoIP.lookup(nowIp);
	var geoUpdate = {};
	for(var property in geo) {
		if (property != 'range') {
			geoUpdate[property] = geo[property];
		}
	}
	geoUpdate['ip'] = nowIp;
	if (thisUser.status == undefined ||
		thisUser.status.firstLogin == undefined){
		db.users.update({_id:thisUser._id},{$set:{status:{geo:geoUpdate,firstLogin: new Date()}}});
	}
	db.logins.insert({
		userId: thisUser._id,
		createdAt: new Date(),
		ip: nowIp,
		country: geoUpdate.country,
		region: geoUpdate.region,
		city: geoUpdate.city,
		ll: geoUpdate.ll,
		metro: geoUpdate.metro

	});
});