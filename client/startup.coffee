PNotify.prototype.options.styling = 'fontawesome'
#PNotify.desktop.permission()

Meteor.startup ->
  moment.locale 'ru'
  TAPi18n.setLanguage('ru').done(()->
    log.trace TAPi18n.__ 'formFields.newPass.label'
    _.each(Schemas, (schema) ->
      log.trace schema
      schema.i18n 'formFields'
      schema
    )
  ).fail((error) ->
  )

