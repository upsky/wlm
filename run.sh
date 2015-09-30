#!/usr/bin/env bash

HOST=wlm.he24.ru
SETTINGS="--settings settings.json"

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
        mupx deploy
    ;;
    *)
        echo "usage: $0 [run|ios] params" && exit 1
        ;;
esac