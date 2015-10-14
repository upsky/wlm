Package.describe({
  name: "gwendall:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.2.1",
  git: "https://github.com/gwendall/meteor-impersonate.git",
});

Package.onUse(function (api, where) {

  api.use([
    "accounts-base",
    "reactive-var",
    "templating",
    "gwendall:body-events"
  ], "client");

  api.use([
    "random",
    "underscore",
    "alanning:roles",
  ]);

  api.addFiles([
    "server/lib.js",
    "server/methods.js"
  ], "server");

  api.addFiles([
    "client/lib.js"
  ], "client");

  api.export("Impersonate");

});
