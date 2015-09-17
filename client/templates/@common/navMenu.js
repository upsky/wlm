Template.navMenu.rendered = function() {
  return log.trace('navMenu rendered');
};

Template.navMenu.helpers({
  "iamnavMenu": function() {
    return 'iam navMenu';
  },
  "mainMenuStatus": function() {
    if (Session.get('userMenuStatus')) {
      return 'expanded';
    } else {
      return '';
    }
  }
});

Template.navMenu.events({
  "click #navMenu": function(event) {
    return log.trace('click #navMenu');
  },
  "click #logoutHref": function(event) {
    Meteor.logout();
    return Router.go('/login');
  },
  "click": function(event) {
    return Session.set('userMenuStatus', false);
  }
});
