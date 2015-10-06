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
	},
	emailHash: {
		type: String
	}
});

Schemas.recoverPass = new SimpleSchema({
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	}
});
/**
 * TODO translate this
 */
SimpleSchema.messages({
	"passwordMismatch": 'Пароли не совпадают'
});

Schemas.resetPass = new SimpleSchema({
	newPass: {
		type: String,
		min: 6
	},
	repeatPass: {
		type: String,
		min: 6,
		custom: function () {
			if (this.value !== this.field('newPass').value) {
				return "passwordMismatch";
			}
		}
	}
});


Schemas.videosSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Название",
    max: 200
  },
  youtubeId: {
  	type: String,
  	label: "Ссылка на youtube"
  },
  info: {
    type: String,
    label: "Инфо о видео"
  },
  _id: {
  	type: String,
  	optional: true
  },
  name: {
    type: String,
    label: "Кнопка",
    max: 64
  }
});
