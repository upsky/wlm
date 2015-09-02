Template.changePass.rendered = ()->
  log.trace 'changePass rendered'

Template.changePass.helpers
  changePass:
    blockId: "changePass"

Template.changePass.events
  "click #changePass": (event)->
    log.trace 'click #changePass'