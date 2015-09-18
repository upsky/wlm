var template = Template.inviteCode;

template.onRendered(function () {
  this.autorun(function () {
    Meteor.call('checkQr');
    var qr = db.invites.findOne({status: 'qr'});

    if (qr) {
      Session.set('inviteCode', qr._id);
    } else {
      Session.set('inviteCode', null);
    }
  });
});


template.helpers({
  panelData: {
    blockId: 'qrCode'
  },
  inviteCode: function () {
    return Session.get('inviteCode');
  }
});