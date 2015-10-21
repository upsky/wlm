Meteor.methods({
	checkLogin: function (doc) {
		var user;
		check(doc, {
			login: String,
			password: String
		});
		log.trace(doc);
		user = db.users.findOne({
			$or: [
				{
					'username': doc.login
				}, {
					'emails.address': doc.login
				}
			]
		});
		if (!user) {
			throw new Meteor.Error(400, 'User not found');
		}
		if (user.status === 'blocked') {
			throw new Meteor.Error(490, 'User blocked');
		}
		return user.username;
	},

	updateProfile: function (doc) {
		var updateObj;
		check(doc, Object);
		log.trace(doc);
		updateObj = {};
		if (doc.name != null) {
			updateObj['$set'] = {
				'profile.name': doc.name,
				'profile.vk': doc.vk,
				'profile.skype': doc.skype,
				'profile.passport': doc.passport
			};
		}

		if (doc.email) {
			var user = Meteor.user();
			// add another email
			if (!_.where(user.emails, { address: doc.email }))
				Accounts.addEmail(this.userId, doc.email);
			// check email not exists before add
			//var user = Meteor.user();
			//if (!_.where(user.emails, { address: doc.email })) {
			//	_.extend(updateObj['$addToSet'], {
			//		emails: {
			//			address: doc.email,
			//			verified: false
			//		}
			//	});
			//}
		}

		if (doc.phone) {
			updateObj['$addToSet'] = {
				'profile.phones': {
					number: doc.phone,
					verified: false
				}
			};
		}
		return db.users.update(this.userId, updateObj);
	},

	recoverPass: function (doc) {
		check(doc, {
			email: String
		});

		var user = Meteor.users.findOne({ emails: { $elemMatch: { address: doc.email } } });

		if (!user) {
			throw new Meteor.Error(400, 'User not found');
		}

		return user.emails[0].address;
	},

	resendVerificationEmail: function () {
		return Accounts.sendVerificationEmail(Meteor.userId());
	}
});
