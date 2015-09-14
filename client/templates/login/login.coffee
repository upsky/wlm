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
          text: TAPi18n.__ 'errors.unknownError'
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
              text: TAPi18n.__ 'errors.loginError'
          else
            Router.go '/'

Template.login.rendered = ()->
  log.trace 'login rendered'

Template.login.helpers
  iamlogin: ()->
    'iam login'
  isCordova: ()->
    true
#Meteor.isCordova

Template.login.events
  "click #login": (event)->
    log.trace 'click #login'
  "click #qr-scanner": (event)->
    params = {
      text_title: "Сканируйте QR-код",
      text_instructions: "Сканирйте код",
      camera: "back",
      flash: "auto",
      drawSight: false
    };
    applyCode('1442168478712');


applyCode = (qrCode) ->
  Meteor.call 'qrApplyCodeMg', qrCode, (error, res)->
    if res.status == 1
      console.log 'asd'
    else if res.status == 2
      console.log res.data
      Router.go '/qr/' + res.data
    else
      Router.go '/qrInvalid/'
return

setError = (error) ->
#Session.set 'currentError', 'Неверный QR-код, попробуйте сканировать другой: ' + error
#Router.go 'error'
  alert(error);
return


#cloudSky.zBar.scan(params, applyCode, setError);