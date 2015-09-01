Template.panel.rendered = ()->
  log.trace 'panel rendered'

Template.panel.helpers
  iampanel: ()->
    log.trace @
  blockTitle: ()->
    log.trace @
    "blockTitles." + @blockId

Template.panel.events
  "click #panel": (event)->
    log.trace 'click #panel'