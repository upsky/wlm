fadeIn = ()->
  setTimeout(->
    $('.sidebar, .wrapper').addClass 'animated fadeInUp'
    setTimeout(->
      $('.sidebar, .wrapper').removeClass('animated fadeInUp').css 'opacity', '1'
    , 1050)
  , 50)

Template.blocked.rendered = ()->
  fadeIn()
Template.down.rendered = ()->
  fadeIn()
Template.error.rendered = ()->
  fadeIn()
