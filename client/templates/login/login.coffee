Schemas.loginSchema = new SimpleSchema
  login:
    type:String
    label: i18n.get "fields.login"
  password:
    type:String
    label: i18n.get "fields.password"

AutoForm.hooks
  loginForm:
    before:
      method: (doc) ->
        Session.set "LoginAttempt", doc.password
        doc.password = "fakePass"
        doc
    onError: (type, error)->
      console.log error
      if error.error == 490
        Router.go "blocked"
      else
        new PNotify
          title: document.title
          type: "error"
          text: i18n.get "errors.unknownError"
    onSuccess: (type, result)->
      console.log result
      if result
        password = Session.get "LoginAttempt"
        Session.set "LoginAttempt", undefined
        Meteor.loginWithPassword result, password, (error)->
          if error
            new PNotify
              title: document.title
              type: "error"
              text: i18n.get "errors.loginError"

Template.login.rendered = ()->
  console.log "login rendered"

Template.login.helpers
  "iamlogin": ()->
    "iam login"

Template.login.events
  "click #login": (event)->
    console.log "click #login"