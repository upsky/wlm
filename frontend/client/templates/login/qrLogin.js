Meteor.loginWithQr = function (qrCode, callback) {
	Accounts.callLoginMethod({
		methodArguments: [{
			qrToken: qrCode
		}],
		userCallback: callback
	});
};