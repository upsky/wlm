/**
 * Created by kriz on 28/08/15.
 */

Template.qrProfileAuth.onRendered(function () {
    var $qr = this.$('#authQr');
    this.autorun(function () {
        $qr.html('');

        var qr = Session.get('qrCode');
        if (!qr)
            return;

        $qr.qrcode({
            size: 100,
            color: "#3a3",
            text: qr
        });
    });
});

Template.qrProfileAuth.helpers({
    code: function () {
        return Session.get('qrCode');
    },

    error: function () {
        return Session.get('currentError');
    }
});

Template.qrProfileAuth.events({
    'click #show': function () {
        Meteor.call('qrGetAuthCode', function (error, code) {
            if (error) {
                Session.set('qrCode', undefined);
                Session.set('currentError', error);
                return;
            }

            console.log('code', code);
            Session.set('qrCode', code);
            Session.set('currentError', undefined);
        });
    }

//    'submit #auth-form': function (env) {
//        env.preventDefault();
//
//        var formVars = $(env.currentTarget).serializeArray();
//        Meteor.call('qrApplyCode', formVars[0].value, function (error, result) {
//            if (error) {
//                console.error(error);
//                return;
//            }
//
//            qrData.set(result);
//        });
//    }
});

//var qrData = new ReactiveVar({});

//Template.refQr.onRendered(function () {
//    this.autorun(function () {
//        var data = qrData.get();
//        if (data.refQr) {
//            var $qr = this.$('#qrcode');
//            $qr.html('');
//            $qr.qrcode({
//                size: 100,
//                color: "#3a0000",
//                text: data.refQr
//            });
//        }
//    });
//});

//Template.refQr.helpers({
//    ref: function () {
//        return qrData.get();
//    }
//});

//Template.refQr.events({
//    'click #auth': function () {
//        var $qr = Template.instance().$('#authQr');
//
//        Meteor.call('qrGetAuthCode', function (error, code) {
//            console.log('code', code);
//            qrCode.set(code);
//            $qr.html('');
//            $qr.qrcode({
//                size: 100,
//                color: "#3a3",
//                text: code
//            });
//        });
//    }
//});