Template.businessEdit.helpers({
	business: function () {
		return db.business.findOne({ownerId: Meteor.userId()});
	}
});

Template.businessEdit.onRendered(function () {
	var data = Template.instance().data;
	if (!_.isEmpty(data.contacts)) {
		$('[name="contacts.address"]').val(data.contacts.address);
		$('[name="contacts.vk"]').val(data.contacts.vk);
		$('[name="contacts.facebook"]').val(data.contacts.facebook);
		$('[name="contacts.phone"]').val(data.contacts.phone);
	}
});

Template.businessEdit.events({
	'click [name=back]': function () {
		history.go(-1);
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

AutoForm.hooks({
	businessEditForm: {
		before: {
			method: function (doc) {
				console.log(doc);
				return doc;
			}
		},
		onError: function (type, error) {
			console.log(error);
		},
		onSuccess: function (type, result) {
			console.log(result);
			history.go(-1);
		}
	}
});