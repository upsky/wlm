Template.settings.rendered = ()->
  log.trace 'settings rendered'

Template.settings.helpers
  settings:
    blockId: "settings"

Template.settings.events
  "click #settings": (event)->
    log.trace 'click #settings'