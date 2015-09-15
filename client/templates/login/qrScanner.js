var template = Template.qrScanner;
var applyCode, setError;

applyCode = function (qrCode) {
  Meteor.call('qrApplyCode', qrCode, function (error, res) {
    if (res.type === 'auth') {

      Accounts.callLoginMethod({
        methodArguments: [{
          qrToken: res.token
        }]
      });
    } else if (res.type === 'invite') {

      Router.go('/qr/' + res.inviteId);

    } else {

      alert('Ваш qr-code уже использован либо истекло время активации.');
    }
  });
};


setError = function (error) {
  //alert(error);
};


template.helpers({
  isCordova: Meteor.isCordova
});

template.events({
  "click #qr-scanner": function () {
    var params = {
      text_title: "Сканируйте QR-код",
      text_instructions: "Сканирйте код",
      camera: "back",
      flash: "auto",
      drawSight: false
    };
    cloudSky.zBar.scan(params, applyCode, setError);
  }

});

