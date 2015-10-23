Router.route('oauthPage', {
    layoutTemplate: function () {
		if (Meteor.user()){
            return 'layoutOauth';
        } else {
			return Meteor.loggingIn() ? 'loading' : 'loginOauth';
        }
    },

    path: '/oauth/authorize',
    template: 'oauthPage',

    onBeforeAction: function () {
        var self = this;
        var req = self.params.query;
        if (!Meteor.userId())
            return;

        var attributes = {
            userId: Meteor.userId(),
            client_id: req.client_id,
            redirect_uri: req.redirect_uri
        };

        console.log('login complete');
        Meteor.call('checkOfCodeForAccessToken', attributes, function (error, result) {
            Session.set('methodResult', {
                result: result
            })
        });

        if (Session.get('methodResult')) {
            var methodResult = Session.get('methodResult');
            if (methodResult.result.checked) {
                var _code = methodResult.result._code;
                Session.set('oauth', req.redirect_uri + '?close=close' + '&code=' + _code + '&state=' + req.state)
            } else if (Session.get('oauth') == undefined) {
                var _code = Random.id();

                console.log(req.client_id);
                console.log(req.redirect_uri);

                attributes.code = _code;

                Meteor.call('insertOauthCode', attributes, function (error, result) {
                    if (error || result.exception) {
                        Session.set('oauth', 'error');
                        console.log(error || result.exception)
                    } else if (result.complete) {
                        console.log('code inserted');
                        Session.set('oauth', req.redirect_uri + '?close=close' + '&code=' + _code + '&state=' + req.state)
                    }
                });
            }

            this.next();
        }
    }
});
