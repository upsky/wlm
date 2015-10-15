var template = Template.personalQrCode;

template.helpers({
  qrCode: {
    blockId: 'qrCode'
  },
  authCode: function () {
    return Session.get('authCode');
  }
});

template.onRendered(function () {
  Session.set('authCode', null);
});

template.events({
  'click .show-qr': function () {
    Meteor.call('qrAuthCode', function (error, authCode) {
      Session.set('authCode', authCode);
    });
  }
});