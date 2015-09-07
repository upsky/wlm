Template.level.rendered = ()->
  log.trace 'level rendered'

Template.level.helpers
  "iamlevel": ()->
    'iam level'
  levelNum: ()->
    currentLevel = db.partners.findOne(Meteor.userId()).level
    @partners[0].level - currentLevel
  partnersCount: ()->
    @partners.length
  username: ()->
    db.users.findOne(@_id)?.username
  name: ()->
    db.users.findOne(@_id)?.profile?.name

Template.level.events
  "click #level": (event)->
    log.trace 'click #level'