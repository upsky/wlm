ProvidersConf = new Mongo.Collection('providersConf');
CodesForAccessToken = new Mongo.Collection('codesForAccessToken');
TokensForOauth = new Mongo.Collection('tokensForOauth')

Meteor.startup(function() {
  ProvidersConf.remove({})
  ProvidersConf.insert(
    Meteor.settings.loginServices.support
  )
  ProvidersConf.insert(
    Meteor.settings.loginServices.trainer
  )
})

HTTP.methods({
  '/oauth/getAccess_token': {
    post: function(data) {
      var _data = data.toString('utf8')
      var arr = _data.split('&');
      var arr2 = [];
      for (var i = 0; i < arr.length; i++) {
        arr2[i] = arr[i].substring(arr[i].indexOf('=') + 1)
          // [0]clientID, [1] client_secret, [2] code, [3]redirect url
      }
      var _client_id = arr2[0];
      var _client_secret = arr2[1];
      var _code = arr2[2];
      var _redirect_uri = decodeURIComponent(arr2[3]);
      if (!(ProvidersConf.findOne({
          'client_id': _client_id,
          'client_secret': _client_secret,
          'redirect_uri': _redirect_uri
        }))) {
        return 'error, unknown client-app'
      }
      var codeDoc = CodesForAccessToken.findOne({
        code: _code,
        redirect_uri: _redirect_uri,
        client_id: _client_id
      })
      CodesForAccessToken.remove({
        code: _code
      })
      if (codeDoc) { //проверка на существование кода, соответствия редирект урл и клиентского приложения
        if (TokensForOauth.findOne({ // если токен запрашивается повторно, удаляем старый
            userId: codeDoc.userId,
            redirect_uri: _redirect_uri
          })) {
          TokensForOauth.remove({
            userId: codeDoc.userId,
            redirect_uri: _redirect_uri
          })
        }
        var _access_token = Random.id();
        TokensForOauth.insert({
          access_token: _access_token,
          userId: codeDoc.userId,
          redirect_uri: _redirect_uri
        })
        var response = {
          access_token: _access_token
        }
        return JSON.stringify(response);
      } else {
        return 'error, not found code'
      }
    }
  },
  '/oauth/getUserData': {
    get: function(data) {
      if (TokensForOauth.findOne({
          access_token: this.query.access_token
        })) {
        var _userId = TokensForOauth.findOne({
          access_token: this.query.access_token
        }).userId;
        var user = Meteor.users.findOne({
          _id: _userId
        });
        var response = {}
        response._id = user._id
        response.username = user.username
        response.fullName = user.profile.fullName || user.profile.name
        if (user.roles)
          response.roles = user.roles
        if (user.phones)
          response.phones = user.phones
        if (user.profile.avatar)
          response.avatar = user.profile.avatar

        TokensForOauth.remove({
          access_token: this.query.access_token
        })
        return response;
      } else {
        return 'error, not found access token'
      }
    }
  }
});

Meteor.methods({
  checkOfCodeForAccessToken: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      userId: String,
      client_id: String,
      redirect_uri: String
    })
    if (CodesForAccessToken.findOne({
        userId: attributes.userId,
        client_id: attributes.client_id,
        redirect_uri: attributes.redirect_uri
      })) {
      var code = CodesForAccessToken.findOne({
        userId: attributes.userId,
        client_id: attributes.client_id,
        redirect_uri: attributes.redirect_uri
      }).code;
      return {
        complete: true,
        checked: true,
        _code: code
      }
    } else {
      return {
        complete: true,
        checked: false
      }
    }

  },
  insertOauthCode: function(attributes) {
    check(Meteor.userId(), String);
    check(attributes, {
      userId: String,
      client_id: String,
      code: String,
      redirect_uri: String
    })
    if (!(ProvidersConf.findOne({
        client_id: attributes.client_id,
        redirect_uri: attributes.redirect_uri
      }))) {
      return {
        exception: 'not found app'
      }
    }
    CodesForAccessToken.insert({
      userId: attributes.userId,
      code: attributes.code,
      client_id: attributes.client_id,
      redirect_uri: attributes.redirect_uri
    });
    return {
      complete: true
    }
  }
})
