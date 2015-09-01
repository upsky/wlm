Schemas.profileSchema = new SimpleSchema
  name:
    type: String
    label: i18n.get 'fields.name'
  phone:
    type: String
    label: i18n.get 'fields.phone'
  email:
    type: String
    label: i18n.get 'fields.email'
  vk:
    type: String
    label: i18n.get 'fields.vk'
    optional: true
  skype:
    type: String
    label: i18n.get 'fields.skype'
    optional: true
  passport:
    type: String
    label: i18n.get 'fields.passport'

Template.personalInf.rendered = ()->
  log.trace 'personalInf rendered'

Template.personalInf.helpers
  personalInf:
    blockId: "personalInf"
  user:
    Meteor.user()

Template.personalInf.events
  "click #personalInf": (event)->
    log.trace 'click #personalInf'