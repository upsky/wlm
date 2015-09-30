/*if (Meteor.isServer) {
	Meteor.methods({
		getCountryChartData: function () {

			var res = [];
			var users = db.users.find().fetch();
			for(var user in users){
				if (user == undefined ||
					users[user].status == undefined ||
					users[user].status.geo == undefined){
					continue;

				}
				var cunt = users[user].status.geo.country;
				var found = false;
				for (var result in res)
				{
					if (res[result].name == cunt) {
						found = true;
						res[result].y+=1;
						break;
					}
				}
				if (!found) {
					res.push({name:cunt, y:1})
				}
			}
			return res;
		}
	});
}
*/