PNotify.prototype.options.styling = 'fontawesome'
#PNotify.desktop.permission()

Meteor.startup ->
  i18n.setLocale 'ru'
  moment.locale 'ru'