Package.describe({
  name: 'overtonik:log-logins',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles([
    'log-logins.js'
  ], 'server');
  api.use([
    "accounts-base@1.2.0",
    "servicelocale:geoip@0.1.3"
  ]);
});