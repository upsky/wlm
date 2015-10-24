Meteor.publish('business', function () {
	return db.business.find({ownerId: this.userId});
});

Meteor.publish('images', function () {
	return db.images.find({ownerId: this.userId});
});

WlmSecurity.addPublish({
	business: {
		authNotRequired: false,
		roles: 'all'
	},
	images: {
		authNotRequired: false,
		roles: 'all'
	}
});

Meteor.methods({
	insertBusiness: function (doc) {
		check(doc, {
			label: String,
			actionSphere: String,
			info: String,
			inn: Number,
			ogrn: Number
		});
		doc.ownerId = Meteor.user()._id;
		doc.owner = Meteor.user().username;
		doc.createDate = new Date();
		if( !_.contains(Meteor.user().roles, "businessMan")) {
			Roles.addUsersToRoles(doc.ownerId, 'businessMan');
		}
		return db.business.insert(doc);
	},
	logo: function (doc) {
		check(doc, {
			imagesURL: String,
			id: String
		});
		db.business.update({_id: doc.id}, { $set: {image: doc.imagesURL}},
			function (error) {
				if(error) {
					console.log(error);
				}
			});
	},
	businessEdit: function (doc) {
		var obj, updateObj = {};
		check(doc, Schemas.businessEdit);
		_.extend(updateObj, doc);
		updateObj.ownerId = Meteor.userId();
		updateObj.owner = Meteor.user().username;
		obj = db.business.findOne({ownerId:Meteor.userId()});
		doc.businessId = obj._id;
		if (obj.image) {
			updateObj.image = obj.image;
		}
		db.business.update(doc.businessId, updateObj);
		return updateObj;
	},
	scheduleEdit: function (doc) {
		var editObject = {};
		check(doc, Schemas.schedule);
		_.extend(editObject, {
			mon: doc.days[0],
			tue: doc.days[1],
			wed: doc.days[2],
			thu: doc.days[3],
			fri: doc.days[4],
			sat: doc.days[5],
			sun: doc.days[6]
		});
		doc.businessId = db.business.findOne({ownerId:Meteor.userId()})._id;
		db.business.update({ _id: doc.businessId }, {
			$set: {
				schedule: editObject
			}
		});
	}
});