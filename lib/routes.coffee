Router.configure
  layoutTemplate: 'miniLayout'
  template: 'error'

Router.plugin 'dataNotFound',
  notFoundTemplate: 'error'

if Meteor.settings.public.isDown
  Router.route '/',
    template: 'down'
  Router.route '/login',
    template: 'down'
else
  Router.route '/login',
    template: 'login'
  Router.route '/',
    layoutTemplate: 'fullLayout'
    template: 'welcome'


Router.onBeforeAction () ->
  if Meteor.userId()
    @next()
  else
    if !Meteor.loggingIn()
      @render 'login'
,
  except: ['login', 'error', 'down', 'loading']