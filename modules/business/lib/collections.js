var base = "";
if (Meteor.isServer) {
  base = process.env.PWD;
}

db.images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: base + "/public/logo/"})]
});

db.images.deny({
 insert: function(){
 return false;
 },
 update: function(){
 return false;
 },
 remove: function(){
 return false;
 },
 download: function(){
 return false;
 }
 });

db.images.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});