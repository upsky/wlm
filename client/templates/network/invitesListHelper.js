Template.inviteListCopyLink.events({
	showLink: function () {
		return (this.status === 'active');
	},
	"click [name=copyLink]": function () {
		Meteor.copyToClipboard(Meteor.getInviteLinks(this._id))
	}
});
Template.inviteListStatus.helpers({
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
	}
});
