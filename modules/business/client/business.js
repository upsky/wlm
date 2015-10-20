Template.business.helpers({
	'business': function() {
		return db.business.findOne({ownerId: Meteor.user()._id});
	}

});
Template.business.events({
	'click [name=edit]': function() {
		Modal.show('aboutEdit');
	},
	'click [name=editSchedule]': function() {
		Modal.show('scheduleEdit');
	},
	'change .myFileInput': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		console.log(files);
   	db.images.insert(files[0], function (err, fileObj) {
      	if (err){
      		console.log(err);
       	} else {
            var doc = {};
            doc.imagesURL = "/cfs/files/images/" + fileObj._id;
            doc.id = db.business.findOne({ownerId:Meteor.userId()})._id;
            Meteor.call('logo', doc);
      		}
     		});
	}
});