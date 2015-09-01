Template.fullLayout.rendered = () ->
  unless Meteor.proton
    Meteor.proton = {}
  Meteor.proton.common =
    build: ->
      Meteor.proton.common.events()
      #proton.common.enableTooltips()

      # On window resize end (throttle protected) execute proton.commonOnResizeEnd function
      resizeEnd = undefined
      resizeThrottleBuffer = 50
      $(window).resize ->
        clearTimeout resizeEnd
        resizeEnd = setTimeout(->
          Meteor.proton.common.onResizeEnd()
        , resizeThrottleBuffer)

      setTimeout (->
        $(".sidebar, .wrapper").addClass "animated fadeInUp"
        setTimeout (->
          $(".sidebar, .wrapper").removeClass("animated fadeInUp").css "opacity", "1"
        ), 1050
      ), 50

    events: ->

      # Disables scroll except for allowed elements that prevent touchmove event propagation
      $(document).on "touchmove", (event) ->
        event.preventDefault()


      # Elements which are allowed touchmove event (by stopping event propagation to document)
      $("body").on "touchmove", ".scrollable, nav", (event) ->
        event.stopPropagation()


      # Prevents scrollable elements from ever reaching the end of scroll, and thus prevents scroll overflow on ipad
      $("body").on "touchstart", ".scrollable", (event) ->
        if event.currentTarget.scrollTop is 0
          event.currentTarget.scrollTop = 1
        else event.currentTarget.scrollTop -= 1 if event.currentTarget.scrollHeight is event.currentTarget.scrollTop + event.currentTarget.offsetHeight

    onResizeEnd: ->
      # if current page has a user menu, move the element when entering mobile mode
      not Meteor.proton.userNav or Meteor.proton.userNav.shuffleUserNav()

      # if current page is a dashboard, fill the row with widget placeholder if there are not enough real widgets
      not Meteor.proton.dashboard or Meteor.proton.dashboard.setBlankWidgets()

      # if current page has graphs, redraw on resize end
      setTimeout (->
        not (Meteor.proton.graphsStats and Meteor.proton.graphsStats.redrawCharts) or Meteor.proton.graphsStats.redrawCharts()
        not (Meteor.proton.userProfile and Meteor.proton.userProfile.redrawCharts) or Meteor.proton.userProfile.redrawCharts()
      ), 1000

      # adjust sidebar CSS for mobile mode change
      not Meteor.proton.sidebar or Meteor.proton.sidebar.retractOnResize()
      not Meteor.proton.sidebar or Meteor.proton.sidebar.setSidebarMobHeight()

    enableTooltips: ->
      # Activate tooltips on all elements with class .uses-tooltip
      $(".uses-tooltip").tooltip container: "#body"
      $(".progress-bar").each (index, el) ->
        progress = Math.round(parseInt($(this).css("width")) / parseInt($(this).parent().css("width")) * 100) + "%"
        $(this).tooltip
          container: "#body"
          title: progress

  Meteor.proton.common.build()

  Meteor.proton.sidebar =
    build: ->
      # Initiate sidebar events
      Meteor.proton.sidebar.events()

      # Build Advanced Search sidebar feature
      not $(".advanced-search").length or Meteor.proton.sidebar.buildAdvancedSearch()

      # Initiate sidebar retraction on smaller screen sizes
      Meteor.proton.sidebar.retractOnResize()

      # Sets max-heigh for sidbar menu in mobile mode (needed for CSS transitions)
      Meteor.proton.sidebar.setSidebarMobHeight()

      # Builds page data for sidebar menu
      Meteor.proton.sidebar.buildPageData()

      # Check if jstree plugin exists, initiate if true
      not $.jstree or Meteor.proton.sidebar.jstreeSetup()

    buildAdvancedSearch: ->
      $(".select2").select2()

      $("input[type=\"radio\"], input[type=\"checkbox\"]").uniform()

    events: ->
      $(document).on "click", ".sidebar-handle", (event) ->
        event.preventDefault()
        Meteor.proton.sidebar.toggleSidebar()

      $(document).on "click", ".btn-advanced-search, .close-advanced-search", (event) ->
        event.preventDefault()
        Meteor.proton.sidebar.toggleAdvancedSearch()


    toggleAdvancedSearch: ->
      $(".sidebar").toggleClass "search-mode"

    toggleSidebar: ->
      $(".sidebar").toggleClass("extended").toggleClass "retracted"
      $(".wrapper").toggleClass("extended").toggleClass "retracted"
      Meteor.proton.sidebar.toggleAdvancedSearch() if $(".sidebar").is(".search-mode")
      if $(".sidebar").is(".retracted")
        $.cookie "protonSidebar", "retracted",
          expires: 7
          path: "/"

      else
        $.cookie "protonSidebar", "extended",
          expires: 7
          path: "/"

      setTimeout (->
        not (Meteor.proton.graphsStats and Meteor.proton.graphsStats.redrawCharts) or Meteor.proton.graphsStats.redrawCharts()
      ), 1000

    retractOnResize: ->
      Meteor.proton.sidebar.toggleSidebar() if $(".sidebar").is(".extended")

    jstreeSetup: ->
      $.jstree._themes = "./styles/vendor/jstree-theme/"

      # the `plugins` array allows you to configure the active plugins on this instance

      # each plugin you have included can have its own config object

      # set a theme
      $("#proton-tree").jstree(
        json_data: proton.sidebar.treeJson
        plugins: [ "themes", "json_data", "ui", "crrm" ]
        core:
          animation: 100
          initially_open: [ "proton-lvl-0" ]

        themes:
          theme: "proton"
      ).on "click", "a", (event) ->
        treeLink = $(this).attr("href")
        document.location.href = $(this).attr("href")  if treeLink isnt "#"
        false

    setSidebarMobHeight: ->
      $(".sidebar").css "max-height", "none"
      setTimeout (->
        sidebarMaxH = $(".sidebar > .panel").height() + 30 + "px"
        $(".sidebar").css "max-height", sidebarMaxH
      ), 200

    doThisLater: ->
      $(".sidebar .sidebar-handle").on "click", ->
        $(".panel, .main-content").toggleClass "retracted"

      # APPLY THEME COLOR
      $("#body").addClass "light-version"  if $.cookie("themeColor") is "light"
      unless $.cookie("jsTreeMenuNotification") is "true"
        $.cookie "jsTreeMenuNotification", "true",
          expires: 7
          path: "/"

        $.pnotify
          title: "Slide Menu Remembers It's State"
          type: "info"
          text: "Slide menu will remain closed when you browse other pages, until you open it again."

    buildPageData: ->
      pageTitle = document.title
      $(".page-title").text pageTitle
      pageTitle = pageTitle.replace("Proton UI - ", "")
      $(".bread-page-title").text pageTitle
      $(".preface p").text pageTitle + " include: "
      Meteor.proton.sidebar.treeJson = data: [
        data:
          title: pageTitle
          attr:
            href: "#top"
            id: "proton-lvl-0"

        children: []
      ]
      numSections = $(".section-title").length
      $(".section-title").each (index, el) ->
        return if $(this).is(".preface-title")
        sectionTitle = $.trim($(this).text())
        sectionId = sectionTitle.replace(/\s+/g, "-").toLowerCase()

        # creates dash-case anchor ID to be used with sidebar links
        $(this).parents(".list-group-item").attr "id", sectionId

        # Add item to breadcrumb nav
        $("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#" + sectionId + "\">" + sectionTitle + "</a></li>").appendTo ".breadcrumb-nav .active .dropdown-menu"

        # creates sidebar link object
        newLinkObject = data:
          title: sectionTitle
          attr:
            href: "#" + sectionId

        Meteor.proton.sidebar.treeJson.data[0].children.push newLinkObject

        # Add item to title bar
        if (index + 1) isnt numSections
          $(".preface p").text $(".preface p").text() + sectionTitle + ", "
        else
          $(".preface p").text $(".preface p").text().slice(0, -2) + " and " + sectionTitle + "."

  Meteor.proton.sidebar.build()
  console.log "fullLayout rendered"

Template.fullLayout.helpers
  "iamfullLayout": () ->
    "iam fullLayout"

Template.fullLayout.events
  "click #fullLayout": (event) ->
    "click #fullLayout"
