Template.personalInf.rendered = ()->
  log.trace 'personalInf rendered'

Template.personalInf.helpers
  iampersonalInf: ()->
    'iam personalInf'
  blockData: ()->
    blockId: ()->
      'personalInf'
    blockTitle: ()->
      'blockTitles.personalInf'

Template.personalInf.events
  "click #personalInf": (event)->
    log.trace 'click #personalInf'