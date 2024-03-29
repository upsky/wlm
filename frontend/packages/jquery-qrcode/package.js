Package.describe({
    summary: "jQuery QR code plugin - a jQuery plugin for generating QR codes",
    // Version number.
    version: "0.2.12",
    // Optional.  Default is package directory name.
    name: "steeve:jquery-qrcode",
    // Optional github URL to your source repository.
    git: "https://github.com/EtherPOS/jquery-qrcode.git",
});

Package.onUse(function (api) {
    api.versionsFrom('0.9.0');
    api.use('jquery', 'client');
    api.addFiles([
            'lib/jquery.qrcode-0.12.js',
        ], 'client');
});