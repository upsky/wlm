#!/usr/bin/env bash

DEFAULT_HOST=market.winlevel.ru
METEOR=/usr/local/bin/meteor
SETTINGS="--settings=settings.json"
CWD=`pwd`
BUILD_DIR=$CWD/../wlmbuild
CROSSWALK_COPY_DIR=$CWD/../wlmbuild-18-copy
CROSSWALK_BUILD_DIR=$CWD/../wlmbuild-18
DEPLOY_CONF_DIR=$CWD/xdeploy

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

function sign-android() {
    IN=$1
    OUT=$2

    rm -f $OUT
    jarsigner -keystore $ANDROID_KEYSTORE -storepass $ANDROID_STORE_PASS -keypass $ANDROID_KEY_PASS $IN ../wlmbuild/android/rp.key

    ZIPALIGN=~/.meteor/android_bundle/android-sdk/build-tools/23.0.1/zipalign
    $ZIPALIGN -f -v 4 $IN $OUT | grep -v "(OK"
}


check frontend



case $1 in
    "")
        $0 run ;;
    run|debug)
        pushd frontend
        rm -f public/i18n/*.json
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
        sign-android $ANDROID_DIR/$UNSIGNED_APK $ANDROID_DIR/wlmarket-19.apk
        ;;
    android-sign-crosswalk)
        sign-android $CROSSWALK_BUILD_DIR/android/project/build/outputs/apk/android-$2-release-unsigned.apk $ANDROID_DIR/wlmarket-18-$2.apk
        ;;
    deploy-meteor)
        pushd frontend
        $METEOR deploy $HOST $SETTINGS ;;
    build-all)
        $0 build > build.log &
        $0 build-crosswalk > build-crosswalk.log
        ;;
    build)
        pushd frontend
        meteor reset
        $METEOR build $BUILD_DIR $SERVER --mobile-settings $DEPLOY_CONF_DIR/wlm-settings.json || exit 1
        popd
        $0 android-sign
        ;;
    build-crosswalk)
        rm -rf $CROSSWALK_COPY_DIR
        pushd frontend
            meteor reset
        popd

        cp -r $CWD/frontend $CROSSWALK_COPY_DIR

        pushd $CROSSWALK_COPY_DIR
            MC=mobile-config.js
            grep -v "App.setPreference('android-minSdkVersion'" $MC > ${MC}_
            mv -f ${MC}_ $MC
            echo "App.setPreference('android-maxSdkVersion', '18');" >> $MC
            echo "crosswalk" >> .meteor/packages
            $METEOR build $CROSSWALK_BUILD_DIR $SERVER --mobile-settings $DEPLOY_CONF_DIR/wlm-settings.json || exit 1
        popd
        $0 android-sign-crosswalk armv7
        $0 android-sign-crosswalk x86
        ;;
    deploy)
        #rm -rf public/i18n/*.json
        #pushd frontend
        mupx deploy --config=$CWD/deploy/$2-mup.json --settings=$DEPLOY_CONF_DIR/$2-settings.json
        ;;
    reconfig|logs)
        pushd frontend
        mupx $1 --config=$CWD/deploy/$2-mup.json --settings=$DEPLOY_CONF_DIR/$2-settings.json $3 $5
        ;;
    *)
        echo "usage: $0 [run|ios] params" && exit 1
        ;;
esac
