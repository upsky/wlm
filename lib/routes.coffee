Router.configure
  layoutTemplate: 'miniLayout'
  template: 'error'
  title: ->
    i18n.get 'pageTitles.' + @route._path

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

Router.onBeforeAction ->
  if Meteor.userId()
    @next()
  else
    if !Meteor.loggingIn()
      @layout 'miniLayout'
      @render 'login'
      @stop()
    else
      @layout "miniLayout"
      @render 'loading'
      @next()
,
  except: ['login', 'error', 'down', 'loading', 'blocked']