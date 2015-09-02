Template.userRow.rendered = ()->
  log.trace 'userRow rendered'

Template.userRow.helpers
  "iamuserRow": ()->
    'iam userRow'

Template.userRow.events
  "click #userRow": (event)->
    log.trace 'click #userRow'
  "click .btn-impersonate": (event) ->
