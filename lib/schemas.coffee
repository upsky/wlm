@Schemas = {}

SimpleSchema.debug = true

Schemas.loginSchema = new SimpleSchema
  login:
    type:String
  password:
    type:String

Schemas.inviteSchema = new SimpleSchema
  name:
    type: String
  email:
    type: String

Schemas.profileSchema = new SimpleSchema
  name:
    type: String
  phone:
    type: String
  email:
    type: String
  vk:
    type: String
    optional: true
  skype:
    type: String
    optional: true
  passport:
    type: String

Schemas.passSchema = new SimpleSchema
  oldPass:
    type: String
  newPass:
    type: String
  confirmPass:
    type: String