Template.userMenu.rendered = ()->
  unless Meteor.proton
    Meteor.proton = {}
  Meteor.proton.userNav =
    build: ->

      # Initiate userNav events
      Meteor.proton.userNav.events()

      # Check screen size, shuffle user nav if needed
      Meteor.proton.userNav.shuffleUserNav()

      # Bounce notification counter
      setTimeout (->
        Meteor.proton.userNav.bounceCounter()
      ), 3000

    events: ->
      $(document).on "click", ".user-menu-wrapper a", (event) ->
        viewToToggle = $(this).attr("data-expand")
        if $(this).is(".unread")
          $(this).removeClass "unread"
          $(this).find(".menu-counter").fadeOut "100", ->
            $(this).remove()

        $("nav.main-menu").removeClass "expanded"
        $(".main-menu-access").removeClass "active"
        $("nav.user-menu > section .active").not(this).removeClass "active"
        $(this).toggleClass "active"
        $(".nav-view").not(viewToToggle).fadeOut 60
        setTimeout (->
          $(viewToToggle).fadeToggle 60
        ), 60
        false

      $(document).on "click", ".close-user-menu", (event) ->
        $("nav.user-menu > section .active").removeClass "active"
        $(".nav-view").fadeOut 30

      $(document).on "click", ".theme-view li", (event) ->
        theme = $(this).attr("data-theme")
        $("#body").removeClass (index, css) ->
          (css.match(/\btheme-\S+/g) or []).join " "

        $.cookie "protonTheme", theme,
          expires: 7
          path: "/"

        return  if theme is "default"
        $("#body").addClass theme


    shuffleUserNav: ->
      #$(".wrapper .user-menu").prependTo $("#body")

    bounceCounter: ->
      return  unless $(".menu-counter").length
      $(".menu-counter").toggleClass "animated bounce"
      setTimeout (->
        $(".menu-counter").toggleClass "animated bounce"
      ), 1000
      setTimeout (->
        Meteor.proton.userNav.bounceCounter()
      ), 5000

  Meteor.proton.userNav.build()

Template.userMenu.helpers
  iamuserMenu: ()->
    'iam userMenu'
  userTitle: ()->
    if Meteor.user()
      Meteor.user().username
    else
      log.warn "Meteor.user() undefined"

Template.userMenu.events
  "click #userMenu": (event)->
    'click #userMenu'