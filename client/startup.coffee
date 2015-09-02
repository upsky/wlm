PNotify.prototype.options.styling = 'fontawesome'
#PNotify.desktop.permission()

Meteor.startup ->
  moment.locale 'ru'
  TAPi18n.setLanguage('ru').done(()->
    _.each(Schemas, (schema) ->
      schema.i18n 'formFields'
      schema
    )
  ).fail((error) ->
    log.warn "i18n dont loaded: " + error
  )

