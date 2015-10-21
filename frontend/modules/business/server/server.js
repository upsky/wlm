Meteor.publish('business', function () {
	//log.trace('publish activeInvites for', this.userId);
	// return db.business.find({owner: this.userId})
	return db.business.find({});
});

Meteor.publish('images', function () {
	//log.trace('publish activeInvites for', this.userId);
	// return db.business.find({owner: this.userId})
	return db.images.find({});
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
// db.images.allow({
// 	'insert': function () {
// 		return true;
// 	}
// });

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
		if( !_.contains(Meteor.user().roles, "businessMan")) {
			db.users.update({ _id: doc.ownerId }, {
				$push: {
					roles: 'businessMan'
				}
			});
		}
		return db.business.insert(doc);
	},
	logo: function (doc) {
		console.log('begin');
      db.business.update({_id: doc.id}, { $set: {image: doc.imagesURL}},
      	function (error) {
   			if(error) {
   				console.log(error);
   			}
   		});
	},
	aboutEdit: function (doc) {
		check(doc, {
			info: String,
			inn: Number
		});
		doc.businessId = db.business.findOne({ownerId:Meteor.userId()})._id;
			db.business.update({ _id: doc.businessId }, {
				$set: {
					info: doc.info,
					inn: doc.inn
				}
			});
	},
	scheduleEdit: function (doc) {
		var editObject = {};
		check(doc, {
			monday: String,
			tuesday: String,
			wednesday: String,
			thursday: String,
			friday: String,
			saturday: String,
			sunday: String
		});
		_.extend(editObject, {
			mon: doc.monday,
			tue: doc.tuesday,
			wed: doc.wednesday,
			thu: doc.thursday,
			fri: doc.friday,
			sat: doc.saturday,
			sun: doc.sunday
		});
		doc.businessId = db.business.findOne({ownerId:Meteor.userId()})._id;
		db.business.update({ _id: doc.businessId }, {
			$set: {
				schedule: editObject
			}
		});
	}
});