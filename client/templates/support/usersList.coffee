Template.usersList.onCreated ()->
  @subscribe "usersList", {}

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
  users: ()->
    log.trace "users helper"
    a = db.users.find
      _id:
        $ne:Meteor.userId()
    a

Template.usersList.events
  "click #usersList": (event)->
    log.trace 'click #usersList'