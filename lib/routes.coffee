Router.configure
  layoutTemplate: 'miniLayout'
  loadingTemplate: 'loading'
  template: 'error'
  progressDebug : true

Router.plugin 'dataNotFound',
  notFoundTemplate: 'error'

if Meteor.settings.public.isDown
  Router.route '/',
    template: 'down'
else
  Router.route '/loading',
    layoutTemplate: 'miniLayout'
    template: 'loading'

  Router.route '/login',
    layoutTemplate: 'miniLayout'
    template: 'login'

  Router.route '/blocked',
    layoutTemplate: 'miniLayout'
    template: 'blocked'

  Router.route '/',
    layoutTemplate: 'fullLayout'
    template: 'welcome'
    waitOn: ()->
      Meteor.subscribe 'partnerDoc'

  Router.route '/network',
    layoutTemplate: 'fullLayout'
    template: 'network'
    waitOn: ()->
      Meteor.subscribe 'networkData'
      Meteor.subscribe 'activeInvites'
      Meteor.subscribe 'partnerDoc'

  Router.route '/profile',
    layoutTemplate: 'fullLayout'
    template: 'profile'

  Router.route '/support',
    layoutTemplate: 'fullLayout'
    template: 'support'

Router.onBeforeAction (location)->
  log.trace 'onBeforeAction '
  if Meteor.userId()
    @next()
  else
    if !Meteor.loggingIn()
      @layout 'miniLayout'
      @render 'login'
      #@stop()
    else
      @layout 'miniLayout'
      @render 'loading'
      @next()
,
  except: ['login', 'error', 'down', 'loading', 'blocked']

Router.onRun ()->
  Session.set 'currentPath', @url