Template.settings.rendered = ()->
  log.trace 'settings rendered'

Template.settings.helpers
  "iamsettings": ()->
    'iam settings'
  blockData: ()->
    blockId: ()->
      'settings'
    blockTitle: ()->
      'blockTitles.settings'

Template.settings.events
  "click #settings": (event)->
    log.trace 'click #settings'