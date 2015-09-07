
var template = Template.inviteCode;

template.onCreated(function() {
	Session.set('qrInviteImageUrl', 'http://9.mshcdn.com/wp-content/uploads/2011/04/500QR-Code1.jpg');
});

template.helpers({
	qrCode: {
		blockId: 'qrCode'
	},
	qrInviteImageUrl: function() {
		return Session.get('qrInviteImageUrl');
	}
});