Meteor.methods({
    qrApplyCodeMg: function (qrCode) {
        check(qrCode, String);

        var res = {};
        var user, invite;

        //var user = db.users.findOne({invite: {qr: {code: qrCode}}});
        user = db.users.findOne({}, {'invite.qr.code': qrCode});
        invite = db.invites.findOne({status: 'qr'})


        if (user) {
            res.status = 1;
            res.data = CryptoJS.MD5('someToken').toString();
        } else if (invite) {
            res.status = 2;
            res.data = invite._id;
        } else {
            res.status = 3;
            res.data = '';
        }

        res.status = 2;
        res.data = invite._id;


        return res;
    },
    getQrCode: function () {
        var currentUser, currentTimeStamp, deltaTime, qrLifetime, newCode;

        currentUser = db.users.findOne(Meteor.userId());
        //qrLifetime = 5 * 60 * 60 * 1000;// 5 minutes
        qrLifetime = 1000;// 1 sec
        currentTimeStamp = new Date().getTime();
        deltaTime = (currentUser.hasOwnProperty('invite') ? currentTimeStamp - currentUser.invite.qr.created : null);


        if (deltaTime !== null && deltaTime < qrLifetime) {
            return currentUser.invite.qr.code;
        }

        /*
         TODO
         */
        newCode = new Date().getTime();

        db.users.update(Meteor.userId(), {
            $set: {
                invite: {
                    //tokens: [],
                    qr: {
                        token: '',
                        code: newCode,
                        created: new Date().getTime()
                    }
                }
            }
        });

        return newCode;
    }

})
;
