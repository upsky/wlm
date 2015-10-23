var base = '';
if (Meteor.isServer) {
	base = process.env.PWD;
	imageStore = new FS.Store.FileSystem("images");
}

if (Meteor.isClient) {
	imageStore = new FS.Store.FileSystem("images");
}

db.images = new FS.Collection("images", {
	stores: [imageStore],
	filter: {
		allow: {
			contentTypes: ['image/*'] //allow only images in this FS.Collection
		}
	}
});

db.images.allow({
	insert: function(userId){
		return !!userId;
	},
	update: function(userId){
		return !!userId;
	},
	remove: function(userId){
		return !!userId;
	},
	download: function(){
		return true;
	}
});