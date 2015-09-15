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
      size: parseInt($qr().css('width')),
      color: "#000",
      text: qrCode
    });
    /**
     * TODO errors handlers
     */
  });
});
