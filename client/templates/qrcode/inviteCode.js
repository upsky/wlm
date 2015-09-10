var template = Template.inviteCode;

template.onCreated(function () {
  Meteor.call('checkQr');
});

template.onRendered(function () {
  var self = this;
  this.autorun(function () {
    var qr = db.invites.findOne({status: 'qr'});
    if (qr) {
      var $qr = self.$('#invite-qr');
      var width = parseInt($qr.css('width'));
      $qr.html('');
      $qr.qrcode({
        size: width,
        color: "#3a3",
        text: qr._id
      });
      Session.set('inviteQr', qr._id);
    }
  });
});

template.helpers({
  panelData: {
    blockId: 'qrCode'
  },

  qrCode: function () {
    return Session.get('inviteQr');
  }
});