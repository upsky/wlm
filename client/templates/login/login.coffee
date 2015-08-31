Template.login.rendered = ()->
  c.log "login rendered"

Template.login.helpers
  "iamlogin": ()->
    "iam login"

Template.login.events
  "click #login": (event)->
    c.log "click #login"