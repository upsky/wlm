Template.qrGenerate.onRendered(function () {
  this.autorun(function () {
    var qrCode = Template.currentData().code;
    var $qr = function () {
      return self.$('.qr-code');
    };

    $qr().html('');
    if (!qrCode)
      return;

    $qr().qrcode({
      render: 'image',
      color: "#000",
      text: qrCode
    });
    /**
     * TODO errors handlers
     */
  });
});
