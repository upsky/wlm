Package.describe({
    name: 'cutter-paginator',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.use([
        "reactive-var@1.0.5",
        "templating@1.0.11",
        "session",
    ], "client");
    //api.versionsFrom('1.1.0.3');
    //api.use('templating');
    //api.use('session');


    api.addFiles([
        'templates.html',
        'client.js',
    ], 'client');
/*
    api.addFiles([
        'templates.html'
    ], 'web.browser');
*/
    api.export('CutterPaginator');
});
