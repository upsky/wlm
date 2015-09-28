if (Meteor.isServer) {

  Accounts.onLogin (function(res){
    var thisUser = res.user;
    var checkResult = false;
    if (thisUser.status == undefined) {
      checkResult = true;
    }
    else if (thisUser.status.firstLogin == undefined) {
      checkResult = true;
    }
    if (checkResult){

     /* var nowIp = res.connection.clientAddress;
       на локалке не сработает*/
      var nowIp = "95.78.127.164";
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