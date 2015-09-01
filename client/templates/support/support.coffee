Template.support.rendered = ()->
  log.trace 'support rendered'

Template.support.helpers
  "iamsupport": ()->
    'iam support'

Template.support.events
  "click #support": (event)->
    log.trace 'click #support'