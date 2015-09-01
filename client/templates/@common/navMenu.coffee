Template.navMenu.rendered = ()->
  log.trace 'navMenu rendered'

Template.navMenu.helpers
  "iamnavMenu": ()->
    'iam navMenu'

Template.navMenu.events
  "click #navMenu": (event)->
    log.trace 'click #navMenu'
  "click #logoutHref": (event)->
    Meteor.logout()
    Router.go '/login'