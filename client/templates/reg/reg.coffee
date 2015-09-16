AutoForm.hooks
  regForm:
    before:
      method: (doc)->
        log.trace doc
        doc.email = doc.email.toLowerCase()
        Session.set("email", doc.email)
        Session.set("password", doc.newPass)
        doc
    after:
      method: (result)->
        result
        Meteor.loginWithPassword(Session.get("email"), Session.get("password"))
        Router.go '/'

Template.reg.rendered = ()->
  log.trace 'reg rendered'
  setTimeout(->
    $('.sidebar, .wrapper').addClass 'animated fadeInUp'
    setTimeout(->
      $('.sidebar, .wrapper').removeClass('animated fadeInUp').css 'opacity', '1'
    , 1050)
  , 50)

Template.reg.helpers
  "iamreg": ()->
    'iam reg'
  inviteUsed: ()->
    @status == 'used'

Template.reg.events
  "click #reg": (event)->
    log.trace 'click #reg'