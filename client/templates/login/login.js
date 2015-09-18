AutoForm.hooks({
  loginForm: {
    before: {
      method: function(doc) {
        Session.set('LoginAttempt', doc.password);
        doc.password = 'fakePass';
        return doc;
      }
    },
    onError: function(type, error) {
      console.log(error);
      if (error.error === 490) {
        return Router.go('blocked');
      } else {
        return new PNotify({
          title: document.title,
          type: 'error',
          text: TAPi18n.__('errors.unknownError')
        });
      }
    },
    onSuccess: function(type, result) {
      var password;
      console.log(result);
      if (result) {
        password = Session.get('LoginAttempt');
        Session.set('LoginAttempt', void 0);
        return Meteor.loginWithPassword(result, password, function(error) {
          if (error) {
            log.info(error);
            return new PNotify({
              title: document.title,
              type: 'error',
              text: TAPi18n.__('errors.loginError')
            });
          } else {
            return Router.go('/');
          }
        });
      }
    }
  }
});

Template.login.rendered = function() {
  return log.trace('login rendered');
};

Template.login.helpers({
  iamlogin: function() {
    return 'iam login';
  }
});

Template.login.events({
  "click #login": function() {
    return log.trace('click #login');
  }
});
