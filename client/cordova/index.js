if (Meteor.isCordova) {
  Meteor.startup(function () {
    var lastUser = null;

    if (Meteor.userId() === null) {
      Meteor.call('cordovaAutoLogin', function (error, res) {
        if (res) {
          Accounts.callLoginMethod({
            methodArguments: [{
              qrToken: res.qrToken
            }]
          });
        }
      });
    } else {

      Deps.autorun(function () {
        if (lastUser) {
          Meteor.call('cordovaAfterLogout', lastUser._id);
        }
        lastUser = Meteor.user();
      });
    }
  })
}