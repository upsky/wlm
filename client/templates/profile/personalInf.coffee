Template.personalInf.rendered = ()->
  log.trace 'personalInf rendered'

Template.personalInf.helpers
  personalInf:
    blockId: "personalInf"
  user:()->
    Meteor.user()

Template.personalInf.events
  "click #personalInf": (event)->
    log.trace 'click #personalInf'