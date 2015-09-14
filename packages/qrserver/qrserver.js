////var generateId = function () {
////    return Random.id(13);
////};
////
////var generateQr = function () {
////    return generateId();
////};
//
////var createUserReferral = function (parentId) {
////    var userLogin = Random.id();
////    var password = Random.id();
////    var userId = Accounts.createUser({
////        username: userLogin,
////        password: password
////    });
////    Meteor.users.update({ _id: userId }, {
////        $set: {
////            'refParentId': parentId,
////            'services.qr.password': password
////        }
////    });
////
////    return userId;
////};
//
////var updateQrToken = function (method, userId) {
////    var user = Meteor.user();
////    if (!user)
////        throw new Meteor.Error(403);
////
////    var token = generateId();
////    Meteor.users.update({ _id: user._id }, { $set: { 'services.qr.token': token } });
////    return token;
////};
//
//
//Accounts.registerLoginHandler(function (request) {
//    check(request.userId, String);
//    check(request.qrToken, String);
//
//    var user = Meteor.users.findOne({ _id: request.userId });
//    if (user && user.services.qr && user.services.qr.token === request.token) {
//        return {
//            userId: user._id
//        };
////        this.setUserId(user._id);
////
////        return { password: user.services.qr.password };
//    }
//    else
//        throw new Meteor.Error(403);
//});
//
//Meteor.methods({
//    qrApplyCode: function (qrCode, deviceId) {
//        if (typeof qrCode !== 'string') {
//            throw  new Meteor.Error(403);
//        }
//
//        var self = this;
//        var code = QrCodes.findOne({ qr: qrCode });
//        if (!code)
//            throw new Meteor.Error(404);
//
//        var token = undefined;
//
//        switch (code.type) {
//            case 'auth':
//                QrCodes.remove({ qr: code.qr });
//
//                token = updateQrToken(self, code.userId);
//
//                var refCode = QrCodes.findOne({ type: 'referral', userId: code.userId });
//                if (!refCode) {
//                    refCode = {
//                        type: 'referral',
//                        qr: generateQr(),
//                        userId: code.userId
//                    };
//                    QrCodes.insert(refCode);
//                }
//
//                return {
//                    userId: code.userId,
//                    type: 'auth',
//                    token: token,
//                    refQr: refCode.qr
//                };
//
//            case 'referral':
//                var userId = createUserReferral(self, code.userId);
//                token = updateQrToken(userId);
//
//                return {
//                    userId: code.userId,
//                    type: 'referral',
//                    token: token,
//                    refQr: refQr
//                };
//        }
//    },
//
//    qrAuthToken: function (userId, token) {
//        check(userId, String);
//        check(token, String);
//
//        var user = Meteor.users.findOne({ _id: userId });
//        if (user && user.services.qr && user.services.qr.token === token) {
//            this.setUserId(user._id);
//
//            return { password: user.services.qr.password };
//        }
//        else
//            throw new Meteor.Error(403);
//    },
//
//    qrGetAuthCode: function () {
//        if (!this.userId)
//            throw new Meteor.Error(403);
//
//        var code = QrCodes.findOne({ type: 'auth', userId: this.userId });
//        if (!code) {
//            code = {
//                type: 'auth',
//                qr: generateQr(),
//                userId: this.userId
//            };
//            QrCodes.insert(code);
//        }
//        return code.qr;
//    }
//
//
//});
//
////Meteor.publish(null, function () {
////    if (this.userId) {
////        return QrCodes.find({ userId: this.userId, type: 'referral' });
////    }
////
////    return null;
////});