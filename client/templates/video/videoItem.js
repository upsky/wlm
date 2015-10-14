Template.videoItem.events({
	'click [name=showVideo]': function () {
		Session.set('video', this._id);
		Modal.show('youtubeModalItem');
	},
	'click [name=removeVideo]': function () {
		Meteor.call('removeVideo', this._id);
	}
});