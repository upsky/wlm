Router.configure
  layoutTemplate: 'defaultLayout'
  loadingTemplate: 'loading'
  template: 'error'
  progressDebug: true




Router.plugin 'dataNotFound',
  notFoundTemplate: 'error'

if Meteor.settings.public.isDown
  Router.route '/',
    template: 'down'
else
  Router.route '/loading',
    layoutTemplate: 'defaultLayout'
    template: 'loading'

  Router.route '/login',
    layoutTemplate: 'defaultLayout'
    template: 'login'

  Router.route '/reg/:_id',
    layoutTemplate: 'defaultLayout'
    template: 'reg'
    name: 'reg'
    data: ()->
      db.invites.findOne @params._id
    waitOn: ()->
      Meteor.subscribe 'invite', @params._id
  Router.route '/qr/:_id',
    layoutTemplate: 'defaultLayout'
    template: 'reg'
    name: 'qr'
    data: ()->
      db.invites.findOne @params._id
    waitOn: ()->
      Meteor.subscribe 'invite', @params._id
    onBeforeAction: ()->
      Meteor.logout
      Meteor.call 'invalidateQr', @params._id
      @next()
  Router.route '/blocked',
    layoutTemplate: 'defaultLayout'
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
      Meteor.subscribe 'lastInvites'
      Meteor.subscribe 'partnerDoc'

  Router.route '/profile',
    layoutTemplate: 'fullLayout'
    template: 'profile'

  Router.route '/qrcode',
    layoutTemplate: 'fullLayout'
    template: 'inviteCode'
    waitOn: ()->
      Meteor.subscribe 'activeInvites'

  Router.route '/support',
    layoutTemplate: 'fullLayout'
    template: 'support'

Router.onBeforeAction (location)->
  log.trace 'onBeforeAction ' + location.url
  if Meteor.userId()
    @next()
  else
    if !Meteor.loggingIn()
      Router.go 'login'
#@stop()
    else
      @layout 'defaultLayout'
      @render 'loading'
      @next()
,
  except: ['login', 'error', 'down', 'loading', 'blocked', 'reg', 'qr']

Router.onRun ()->
  Session.set 'currentPath', @url