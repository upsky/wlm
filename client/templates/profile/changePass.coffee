Schemas.passSchema = new SimpleSchema
  oldPass:
    type: String
    label: i18n.get 'fields.oldPass'
  newPass:
    type: String
    label: i18n.get 'fields.newPass'
  confirmPass:
    type: String
    label: i18n.get 'fields.confirmPass'

Template.changePass.rendered = ()->
  log.trace 'changePass rendered'

Template.changePass.helpers
  changePass:
    blockId: "changePass"

Template.changePass.events
  "click #changePass": (event)->
    log.trace 'click #changePass'