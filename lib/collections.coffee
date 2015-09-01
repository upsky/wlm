@db = {}

db.users = Meteor.users
db.partners = new Meteor.Collection("partners")

db.videos = new Meteor.Collection("videos")