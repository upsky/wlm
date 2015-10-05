#!/usr/bin/env bash

HOST=wlm.he24.ru
SETTINGS="--settings settings.json"

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
        meteor run $SETTINGS
    ;;
    run)
        meteor run $SETTINGS $2 $3 $4
    ;;
    ios)
        meteor run ios-device $SETTINGS --mobile-server=$HOST $2 $3 $4
    ;;
    ios-local)
        meteor run ios-device $SETTINGS $2 $3 $4
    ;;
    android)
        meteor run android-device $SETTINGS --mobile-server=$HOST $2 $3 $4
    ;;
    deploy-meteor)
        meteor deploy $HOST $SETTINGS
    ;;
    build)
        meteor build .out --server=$HOST --mobile-settings settings.json
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
