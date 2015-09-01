Template.usersList.rendered = ()->
  log.trace 'usersList rendered'

Template.usersList.helpers
  "iamusersList": ()->
    'iam usersList'
  blockData: ()->
    blockId: ()->
      'usersList'
    blockTitle: ()->
      'blockTitles.usersList'

Template.usersList.events
  "click #usersList": (event)->
    log.trace 'click #usersList'