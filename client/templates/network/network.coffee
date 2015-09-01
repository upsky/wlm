Template.network.rendered = ()->
  log.trace 'network rendered'

Template.network.helpers
  "iamnetwork": ()->
    'iam network'

Template.network.events
  "click #network": (event)->
    log.trace 'click #network'