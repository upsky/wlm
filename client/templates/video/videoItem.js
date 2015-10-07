Template.videoItem.events({
	'click [name=showVideo]': function () {
			Session.set('video', this.name);
			Modal.show('youtubeModalItem');
	},
	'click [name=removeVideo]': function () {
			Meteor.call('removeVideo', this._id);
	}
});