this.db = {};

db.users = Meteor.users;

db.invites = new Meteor.Collection('invites');

db.partners = new Meteor.Collection('partners');

db.videos = new Meteor.Collection('videos');

db.navBars = new Meteor.Collection('navBars');

db.logLogins = new Meteor.Collection('logLogins');
