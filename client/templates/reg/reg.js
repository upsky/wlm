AutoForm.hooks({
  regForm: {
    before: {
      method: function(doc) {
        log.trace(doc);
        doc.email = doc.email.toLowerCase();
        Session.set("email", doc.email);
        Session.set("password", doc.newPass);
        return doc;
      }
    },
    after: {
      method: function(result) {
        result;
        Meteor.loginWithPassword(Session.get("email"), Session.get("password"));
        return Router.go('/');
      }
    }
  }
});

Template.reg.rendered = function() {
  log.trace('reg rendered');
  return setTimeout(function() {
    $('.sidebar, .wrapper').addClass('animated fadeInUp');
    return setTimeout(function() {
      return $('.sidebar, .wrapper').removeClass('animated fadeInUp').css('opacity', '1');
    }, 1050);
  }, 50);
};

Template.reg.helpers({
  "iamreg": function() {
    return 'iam reg';
  },
  inviteUsed: function() {
    return this.status === 'used';
  }
});

Template.reg.events({
  "click #reg": function(event) {
    return log.trace('click #reg');
  }
});
