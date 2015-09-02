AutoForm.hooks
  regForm:
    after:
      method: (result)->
        Router.go '/'

Template.reg.rendered = ()->
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
    log.trace @status == 'used'
    @status == 'used'

Template.reg.events
  "click #reg": (event)->
    log.trace 'click #reg'