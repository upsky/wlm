var updateQrUser = function (userId) {
  var newCode = Random.id(13);
  db.users.update(userId, {
    $set: {
      'services.qr.code': newCode,
      'services.qr.created': Date.now()
    }
  });
  return newCode;
};

Accounts.registerLoginHandler(function (request) {
  var user, hashStampedToken;

  check(request.qrToken, Object);
  hashStampedToken = Accounts._hashStampedToken(request.qrToken);
  user = Meteor.users.findOne({'services.resume.loginTokens': hashStampedToken});


  if (user) {
    updateQrUser(user._id);
    db.groundConfig.insert(
      {
        userId: user._id,
        qrToken: request.qrToken,
        auth: true
      });
    return {
      userId: user._id
    };
  }
  else
    throw new Meteor.Error(403, 'Auth denied');

});

Meteor.methods({
  qrApplyCode: function (qrCode) {
    var user, invite, deltaTime, qrLifetime, stampedToken, hashStampedToken;

    check(qrCode, String);
    user = db.users.findOne({'services.qr.code': qrCode});
    qrLifetime = 5 * 60 * 60 * 1000;

    if (user) {
      deltaTime = Date.now() - user.services.qr.created;

      if (deltaTime < qrLifetime) {
        stampedToken = Accounts._generateStampedLoginToken();
        hashStampedToken = Accounts._hashStampedToken(stampedToken);

        db.users.update(user._id, {
          $push: {
            'services.resume.loginTokens': hashStampedToken
          }
        });

        return {
          type: 'auth',
          token: stampedToken
        };
      } else {
        return {
          type: 'error'
        };
      }
    }
    else {
      invite = db.invites.findOne({_id: qrCode, status: 'qr'});
      if (invite) {
        return {
          type: 'invite',
          inviteId: invite._id
        };
      }
    }

    return {
      type: 'error'
    };

  },

  qrAuthCode: function () {
    return updateQrUser(this.userId);
  },
  cordovaAutoLogin: function () {
    return db.groundConfig.findOne({auth: true});
  },
  cordovaAfterLogout: function (userId) {
    check(userId, String);
    /**
     * TODO true way before logout
     */
    if (Meteor.isCordova)
      db.groundConfig.update({userId: userId},
        {$set: {auth: false}}
      );

    return true;
  }
});
