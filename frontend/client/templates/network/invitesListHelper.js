Template.inviteListCopyLink.events({
	"click [name=copyLink]": function () {
		Meteor.copyToClipboard(Meteor.getInviteLinks(this._id))
	}
});
Template.inviteListCopyLink.helpers({
	showLink: function () {
		return (this.status === 'active');
	}
});


Template.inviteListStatus.helpers({
	statusText: function () {
		return TAPi18n.__('db.inviteStatus.' + this.status);
	},
	statusColor: function () {
		switch (this.status) {
			case 'active':
				return 'label-danger';
			case 'used':
				return 'label-success';
			default:
				return 'label-default';
		}
	}
});
