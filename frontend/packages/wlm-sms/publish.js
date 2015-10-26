WlmSecurity.addPublish({
	smsList: {
		roles: 'all'
	}
});


Meteor.publish('smsList', function () {
	return db.sms.find({ userId: this._id });
});