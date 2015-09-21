var openUrls = ['login', 'error', 'down', 'loading', 'blocked', 'reg', 'qr'];

Router.configure({
  layoutTemplate: 'defaultLayout',
  loadingTemplate: 'loading',
  template: 'error',
  progressDebug: true
});

Router.plugin('dataNotFound', {
  notFoundTemplate: 'error'
});

if (Meteor.settings["public"].isDown) {
  Router.route('/', {
    template: 'down'
  });
} else {
  Router.route('/loading', {
    layoutTemplate: 'defaultLayout',
    template: 'loading'
  });
  Router.route('/login', {
    layoutTemplate: 'defaultLayout',
    template: 'login'
  });
  Router.route('/reg/:_id', {
    layoutTemplate: 'defaultLayout',
    template: 'reg',
    name: 'reg',
    data: function () {
      return db.invites.findOne(this.params._id);
    },
    waitOn: function () {
      return Meteor.subscribe('invite', this.params._id);
    }
  });
  Router.route('/qr/:_id', {
    layoutTemplate: 'defaultLayout',
    template: 'reg',
    name: 'qr',
    data: function () {
      return db.invites.findOne(this.params._id);
    },
    waitOn: function () {
      return Meteor.subscribe('invite', this.params._id);
    },
    onBeforeAction: function () {
      Meteor.logout;
      Meteor.call('invalidateQr', this.params._id);
      return this.next();
    }
  });
  Router.route('/blocked', {
    layoutTemplate: 'defaultLayout',
    template: 'blocked'
  });
  Router.route('/', {
    template: 'welcome',
    action: function () {
      console.log('/ route 1');
      this.layout('fullLayout');
      return this.render('welcome');
    },
    waitOn: function () {
      return Meteor.subscribe('partnerDoc');
    }
  });
  Router.route('/network', {
    layoutTemplate: 'fullLayout',
    template: 'network',
    waitOn: function () {
      Meteor.subscribe('networkData');
      Meteor.subscribe('activeInvites');
      Meteor.subscribe('lastInvites');
      return Meteor.subscribe('partnerDoc');
    }
  });
  Router.route('/profile', {
    layoutTemplate: 'fullLayout',
    template: 'profile'
  });
  Router.route('/qrcode', {
    layoutTemplate: 'fullLayout',
    template: 'inviteCode',
    waitOn: function () {
      return Meteor.subscribe('activeInvites');
    }
  });
  Router.route('/support', {
    layoutTemplate: 'fullLayout',
    template: 'support'
  });
}

Router.onBeforeAction(
  function (location) {
    log.trace('onBeforeAction ' + location.url);
    if (Meteor.userId()) {
      return this.next();
    }

    if (Meteor.loggingIn()) {
      this.layout('defaultLayout');
      return this.render('loading');
    } else {
      Router.go('login');
    }
  },
  {
    except: openUrls
  }
);


Router.onRun(function () {
  return Session.set('currentPath', this.url);
});
