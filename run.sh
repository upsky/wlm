#!/usr/bin/env bash

DEFAULT_HOST=wlm.he24.ru
METEOR=/usr/local/bin/meteor
SETTINGS="--settings=settings.json"
CWD=`pwd`
BUILD_DIR=$CWD/../wlmbuild

export MAIL_URL=smtp://postmaster%40sandboxfbc452b570544a5d9420aa783c0fda38.mailgun.org:d529975e91ce74e534b19a3ebc6b3d4f@smtp.mailgun.org
export ANDROID_HOME=~/.meteor/android_bundle/android-sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home

. frontend/.run-config.sh

case $HOST in
    "")
        MOBILE_SERVER=--mobile-server=$DEFAULT_HOST
        SERVER=--server=$DEFAULT_HOST
    ;;
    "localhost")
        MOBILE_SERVER=""
        SERVER=""
    ;;
    *)
        MOBILE_SERVER=--mobile-server=$HOST
        SERVER=--server=$HOST
    ;;
esac

# check wlm-security is the first package. to init first before other packages
function check() {
    WLMSEC=`grep -n wlm-security $1/.meteor/packages`
    if [ "$WLMSEC" != "7:wlm-security" ]; then
        echo "please set wlm-security first string in .meteor/packages after comments. thanx. exiting..."
        exit 1
    fi
}

check frontend

case $1 in
    "")
        pushd frontend
        $METEOR run $SETTINGS ;;
    run|debug)
        pushd frontend
        $METEOR $1 $SETTINGS $2 $3 $4 ;;
    ios)
        pushd frontend
        $METEOR run ios-device $SETTINGS $MOBILE_SERVER $2 $3 $4 ;;
    ios-local)
        pushd frontend
        $METEOR run ios-device $SETTINGS $2 $3 $4 ;;
    android)
        pushd frontend
        $METEOR run android-device $SETTINGS $MOBILE_SERVER $2 $3 $4 ;;
    android-sign)
        rm -f $ANDROID_DIR/wlmarket.apk
        #keytool -genkey -keystore $ANDROID_DIR/rp.keystore -storepass $ANDROID_STORE_PASS -alias $ANDROID_DIR/rp.key -keypass $ANDROID_KEY_PASS -validity 10000
        jarsigner -keystore $ANDROID_DIR/rp.keystore -storepass $ANDROID_STORE_PASS -keypass $ANDROID_KEY_PASS $ANDROID_DIR/$UNSIGNED_APK $ANDROID_DIR/rp.key

        ZIPALIGN=~/.meteor/android_bundle/android-sdk/build-tools/23.0.1/zipalign
        $ZIPALIGN -f -v 4 $ANDROID_DIR/$UNSIGNED_APK $ANDROID_DIR/wlmarket.apk
        ;;
    deploy-meteor)
        pushd frontend
        $METEOR deploy $HOST $SETTINGS ;;
    build)
        pushd frontend
        $METEOR build $BUILD_DIR $SERVER --mobile-settings $CWD/deploy/$2-settings.json
        popd
#         $0 android-sign
        ;;
    deploy)
        #rm -rf public/i18n/*.json
        pushd frontend
        mupx deploy --config=$CWD/deploy/$2-mup.json --settings=$CWD/deploy/$2-settings.json
        ;;
    reconfig|logs)
        pushd frontend
        mupx $1 --config=$CWD/deploy/$2-mup.json --settings=$CWD/deploy/$2-settings.json $3 $5
        ;;
    *)
        echo "usage: $0 [run|ios] params" && exit 1
        ;;
esac
