Template.qrGenerate.onRendered(function () {
	var self = this;
	this.autorun(function () {
		// currentData used here for reactivity
		var qrCode = Template.currentData().code;

		var $qr = self.$('.qr-code');
		$qr.html('');

		if (!qrCode) return;

		$qr.qrcode({
			render: 'image',
			color: "#000",
			text: qrCode
		});
		/**
		 * TODO errors handlers
		 */
	});
});
