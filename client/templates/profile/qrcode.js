
var template = Template.personalQrCode;

template.helpers({
	qrCode: {
		blockId: 'qrCode'
	},
	qrImageUrl: function() {
		return Session.get('qrImageUlr');
	}
});

template.events({
	'click .show-qr': function(e) {
		Session.set('qrImageUlr', 'http://blog.esponce.com/wp-content/uploads/2011/08/super-qr-code.gif');
	}
});