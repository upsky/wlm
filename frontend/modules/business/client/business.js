Template.business.helpers({
	'business': function() {
		return db.business.findOne({ownerId: Meteor.user()._id});
	}
});


Template.business.events({
	'click [name=edit]': function() {
		var id = db.business.findOne({ownerId: Meteor.userId()})._id
		Router.go('businessEdit', { _id: id });
	},
	'click [name=editSchedule]': function() {
		Modal.show('scheduleEdit');
	},
	'change .myFileInput': function(event) {
		var files, doc = {};
		var dbImg = db.images;
		files = event.target.files;
		var newFile = new FS.File(files[0]);
		newFile.ownerId = Meteor.userId();
		dbImg.insert(newFile, function (err, fileObj) {
			if (err){
				console.log(err);
				return;
			} else {
				doc.imagesURL = "/cfs/files/images/" + fileObj._id;
				doc.id = db.business.findOne({ownerId:Meteor.userId()})._id;
				Meteor.setTimeout(function () {
					Meteor.call('logo', doc);
				}, 200);
			}
		});
		if (dbImg.find({ownerId: Meteor.user()._id}).count()>1) {
			var id = dbImg.findOne({ownerId: Meteor.userId()}, {sort: {uploadedAt: -1}})._id;
			dbImg.remove({_id: id});
		}
	}
});