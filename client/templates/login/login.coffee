AutoForm.hooks
  loginForm:
    before:
      method: (doc) ->
        Session.set 'LoginAttempt', doc.password
        doc.password = 'fakePass'
        doc
    onError: (type, error)->
      console.log error
      if error.error == 490
        Router.go 'blocked'
      else
        new PNotify
          title: document.title
          type: 'error'
          text: i18n.get 'errors.unknownError'
    onSuccess: (type, result)->
      console.log result
      if result
        password = Session.get 'LoginAttempt'
        Session.set 'LoginAttempt', undefined
        Meteor.loginWithPassword result, password, (error)->
          if error
            log.info error
            new PNotify
              title: document.title
              type: 'error'
              text: i18n.get 'errors.loginError'
          else
            Router.go '/'

Template.login.rendered = ()->
  log.trace 'login rendered'

Template.login.helpers
  iamlogin: ()->
    'iam login'

Template.login.events
  "click #login": (event)->
    log.trace 'click #login'