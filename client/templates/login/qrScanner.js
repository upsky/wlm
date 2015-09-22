var template = Template.qrScanner;

var applyCode = function (qrCode) {
	Meteor.loginWithQr(qrCode, function (error, res) {

		if (error) {// we can't login with this qr
			Meteor.call('qrApplyCode', qrCode, function (error, res) {
				if (error) {
					alert('Ваш qr-code уже использован либо истекло время активации.');
					return;
				}

				Router.go('/qr/' + res.inviteId);
			});
		}
	});
};

setError = function (error) {
	//alert(error);
};


template.helpers({
	isCordova: Meteor.isCordova
});

template.events({
	"click #qr-scanner": function (event) {
		var params = {
			text_title: "Сканируйте QR-код",
			text_instructions: "Сканируйте код",
			camera: "back",
			flash: "auto",
			drawSight: false
		};
		cloudSky.zBar.scan(params, applyCode, setError);
	}

});

