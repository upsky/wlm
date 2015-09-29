Template.inviteItem.helpers({
	statusText: function () {
		return TAPi18n.__('db.inviteStatus.' + this.status);
	},
	statusColor: function () {
		var result;
		result = 'label-default';
		if (this.status === 'active') {
			result = 'label-danger';
		}
		if (this.status === 'used') {
			result = 'label-success';
		}
		return result;
	},
	inviteUsed: function () {
		return this.status === 'used';
	},
	inviteLink: function () {
		return Meteor.getInviteLinks(this._id);
	}
});
