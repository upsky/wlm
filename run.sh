#!/usr/bin/env bash

if [ "$HOST" == "" ]; then
    HOST=wlm.he24.ru
fi

METEOR=/usr/local/bin/meteor
SETTINGS="--settings settings.json"
export MAIL_URL=smtp://test%40wl-market.com:123123@smtp.yandex.com

# check wlm-security is the first package. to init first before other packages
function check() {
    WLMSEC=`grep -n  wlm-security .meteor/packages`
    if [ "$WLMSEC" != "8:wlm-security" ]; then
        echo "please set wlm-security second string in .meteor/packages after meteor-platform. thanx. exiting..."
        exit 1
    fi
}

check

case $1 in
    "")
        $METEOR run $SETTINGS
    ;;
    run)
        $METEOR run $SETTINGS $2 $3 $4
    ;;
    ios)
        $METEOR run ios-device $SETTINGS --mobile-server=$HOST $2 $3 $4
    ;;
    ios-local)
        $METEOR run ios-device $SETTINGS $2 $3 $4
    ;;
    android)
        $METEOR run android-device $SETTINGS --mobile-server=$HOST $2 $3 $4
    ;;
    deploy-meteor)
        $METEOR deploy $HOST $SETTINGS
    ;;
    build)
        $METEOR build .out --server=$HOST --mobile-settings settings.json
    ;;
    deploy)
        mupx deploy --config=private/deploy/$2-mup.json --settings=private/deploy/$2-settings.json
    ;;
    reconfig)
        mupx reconfig --config=private/deploy/$2-mup.json --settings=private/deploy/$2-settings.json
    ;;
    *)
        echo "usage: $0 [run|ios] params" && exit 1
        ;;
esac
