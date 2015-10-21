#!/bin/bash

FE=`pwd`/../frontend
OUT_DIR=$FE
LOGO_DIR=$FE/private/images

function convert_() {
    FROM=$1
    SIZE=$2
    OUT=$3
    if [ "$4" == "" ];
        then OPT="-alpha on";
        else OPT=$4; fi

    echo making $FROM "->" $SIZE "->" $OUT $OPT

    convert -density 144x144 $LOGO_DIR/$FROM -resize $SIZE^ -gravity Center -crop $SIZE+0+0 +profile "*" -units PixelsPerInch $OPT $OUT_DIR/$OUT
    # -background white -alpha off
}

L=logo_2208x2208.png # logo no text
LROUND=logo_round_2208x2208.png # logo no text
LTEXT=logo_text_2208x2208.png # logo with texxt
LWL=logo_wl_2208x2208.png # with WL Market text
LWLC=logo_wlc_2208x2208.png # with WL Market text. in the center of the picture /2 size

convert_ $L 48x48 public/favicon.ico -flatten
convert_ $L 16x16 public/favicon-16x16.png
convert_ $L 32x32 public/favicon-32x32.png
convert_ $L 96x96 public/favicon-96x96.png

convert_ $L 1024x1024 mobile/market/default-icon.png -flatten
convert_ $L 1024x500 mobile/market/marketplace-recommend.png
convert_ $L 320x180 mobile/market/marketplace-tv.png
convert_ $LWL 180x120 mobile/market/marketplace-ad.png
convert_ $LTEXT 512x512 mobile/market/marketplace-artwork.png
convert_ $L 128x128 mobile/market/android-appicon.png

convert_ $L 36x36 mobile/icons/android-chrome-36x36.png
convert_ $L 48x48 mobile/icons/android-chrome-48x48.png
convert_ $L 72x72 mobile/icons/android-chrome-72x72.png
convert_ $L 96x96 mobile/icons/android-chrome-96x96.png

convert_ $L 80x80 mobile/icons/apple-touch-icon-80x80.png
convert_ $L 120x120 mobile/icons/apple-touch-icon-120x120.png
convert_ $L 180x180 mobile/icons/apple-touch-icon-180x180.png

convert_ $LWLC 240x320 mobile/splashes/android-240x320.png
convert_ $LWLC 480x800 mobile/splashes/android-480x800.png

convert_ $LWLC 640x960 mobile/splashes/apple-640x960.png
convert_ $LWLC 640x1136 mobile/splashes/apple-640x1136.png
convert_ $LWLC 750x1334 mobile/splashes/apple-750x1334.png
convert_ $LWLC 1080x1920 mobile/splashes/apple-1080x1920.png

convert_ $LTEXT 330x280 public/images/logo_330x280.png
convert_ $LWL 180x150 public/images/logo_180x150.png

# make android 9-patch image
#convert_ $L 960x1600 splashes/platform/android/res/drawable-xxhdpi/background.9.png
