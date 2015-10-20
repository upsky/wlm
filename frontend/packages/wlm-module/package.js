Package.describe({
  name: 'wlm-module',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.imply('tap:i18n');
  api.imply('underscore');
  api.imply('iron:router');
  api.imply('wlm-core');
  api.use('ecmascript');
  api.addFiles('wlm-module.js');

  api.export('WlmModule');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('wlm-module');
  api.addFiles('wlm-module-tests.js');
});
