Template.changePass.rendered = ()->
  log.trace 'changePass rendered'

Template.changePass.helpers
  "iamchangePass": ()->
    'iam changePass'
  blockData: ()->
    blockId: ()->
      'changePass'
    blockTitle: ()->
      'blockTitles.changePass'

Template.changePass.events
  "click #changePass": (event)->
    log.trace 'click #changePass'