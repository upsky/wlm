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
		switch (this.status) {
			case 'active':
				return 'label-success';
			case 'used':
				return 'label-danger';
			default:
				return 'label-default';
		}
	}
});
