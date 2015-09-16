Accounts.registerLoginHandler(function (request) {
  check(request, {qrToken: String});

  var user = Meteor.users.findOne({'services.qr.code': request.qrToken});
  if (!user)
    throw new Meteor.Error(403, 'Auth denied');


  var userId = user._id;
  var stampedToken = Accounts._generateStampedLoginToken();
  var hashStampedToken = Accounts._hashStampedToken(stampedToken);

  Meteor.users.update(userId,
    {
      $push: {'services.resume.loginTokens': hashStampedToken},
      $unset: {
        'services.qr': ''
      }
    }
  );

  return {
    userId: userId,
    token: stampedToken.token
  };
});

Meteor.methods({
  qrApplyCode: function (qrCode) {
    check(qrCode, String);

    var invite = db.invites.findOne({_id: qrCode, status: 'qr'});
    if (!invite)
      throw new Meteor.Error(403, 'invite not found');

    return {
      inviteId: invite._id
    };
  },

  qrAuthCode: function () {
    var newCode = Random.secret();
    db.users.update(this.userId, {
      $set: {
        'services.qr.code': newCode,
        'services.qr.created': Date.now()
      }
    });
    return newCode;
  }
});
