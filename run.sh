#!/usr/bin/env bash

. .run-config.sh

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
    android-sign)
        keytool -genkey -keystore $ANDROID_DIR/rp.keystore -storepass $ANDROID_STORE_PASS -alias $ANDROID_DIR/rp.key -keypass $ANDROID_KEY_PASS -validity 10000
        jarsigner -keystore $ANDROID_DIR/rp.keystore -storepass $ANDROID_STORE_PASS -keypass $ANDROID_KEY_PASS $ANDROID_DIR/unaligned.apk $ANDROID_DIR/rp.key

        ZIPALIGN=~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign
        $ZIPALIGN -f -v 4 $ANDROID_DIR/unaligned.apk $ANDROID_DIR/wlmarket.apk

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
