#!/usr/bin/env bash

HOST=wlmarket.meteor.com
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
    deploy)
        meteor deploy $HOST $SETTINGS
    ;;
    *)
        echo "usage: $0 [run|ios] params" && exit 1
        ;;
esac
