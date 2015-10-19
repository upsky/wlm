
CatalogCollection.allow({
	insert: function(userId, doc) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	},
	update: function(userId, doc, fields, modifier) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	},
	remove: function(userId, doc) {
		return userId && Meteor.users.findOne(userId).profile.isAdmin;
	}
});