this.Schemas = {};

SimpleSchema.debug = true;

Schemas.loginSchema = new SimpleSchema({
  login: {
    type: String
  },
  password: {
    type: String
  }
});

Schemas.inviteSchema = new SimpleSchema({
  name: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

Schemas.profileSchema = new SimpleSchema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  vk: {
    type: String,
    optional: true
  },
  skype: {
    type: String,
    optional: true
  },
  passport: {
    type: String,
    optional: true
  }
});

Schemas.passSchema = new SimpleSchema({
  oldPass: {
    type: String
  },
  newPass: {
    type: String
  },
  confirmPass: {
    type: String
  }
});

Schemas.regSchema = new SimpleSchema({
  name: {
    type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  newPass: {
    type: String
  },
  _id: {
    type: String
  }
});
