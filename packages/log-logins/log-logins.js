Accounts.onLogin (function(res){
	var thisUser = res.user;
	var nowIp = res.connection.clientAddress;
	var geo = GeoIP.lookup(nowIp);
	var geoUpdate = {
		ip: nowIp,
		country: geo.country,
		region: geo.region,
		city: geo.city,
		ll: geo.ll
	};
	if (thisUser.status == undefined ||
		thisUser.status.firstLogin == undefined){
		db.users.update({_id:thisUser._id},{$set:{status:{geo:geoUpdate,firstLogin: new Date()}}});
	}
	geoUpdate.userId = thisUser._id;
	geoUpdate.createdAt = new Date();
	db.logLogins.insert(geoUpdate);
});
