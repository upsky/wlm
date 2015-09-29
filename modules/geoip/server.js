if (Meteor.isServer) {

  Accounts.onLogin (function(res){
    var thisUser = res.user;
    if (thisUser.status == undefined ||
        thisUser.status.firstLogin == undefined){

      var nowIp = res.connection.clientAddress;
      var geo = GeoIP.lookup(nowIp);
      var geoUpdate = {};
      for(var property in geo) {
        if (property != 'range') {
          geoUpdate[property] = geo[property];
        }
      }
      geoUpdate['ip'] = nowIp;
      db.users.update({_id:thisUser._id},{$set:{status:{geo:geoUpdate,firstLogin: new Date()}}});
    }
  });
}