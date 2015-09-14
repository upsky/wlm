var template = Template.personalQrCode;

template.helpers({
    qrCode: {
        blockId: 'qrCode'
    },
    qrNotGenerated: function () {
        return !Session.get('qrGenerated');
    }
});
template.onRendered(function () {
    Session.set('qrGenerated', false);
});

template.events({
    'click .show-qr': function (e) {
        Meteor.call('getQrCode', function (error, qrCode) {
            console.log(qrCode);

            var $qr = $('#invite-qr');
            var width = parseInt($qr.css('width'));
            $qr.html('');
            $qr.qrcode({
                size: width,
                color: "#000",
                text: qrCode
            });

            Session.set('qrGenerated', true);
        });
    }
});