this.Schemas = {};

SimpleSchema.debug = true;
SimpleSchema.RegEx.Id = /^[2-9A-Za-z]{13,32}$/

/**
 * TODO translate this
 */
SimpleSchema.messages({
	"passwordMismatch": 'Пароли не совпадают'
});


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

Schemas.registerPartner = new SimpleSchema({
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
		type: String,
		regEx: SimpleSchema.RegEx.Id
	},
	emailHash: {
		type: String,
		optional: true
	}
});

Schemas.recoverPass = new SimpleSchema({
	email: {
		type: String,
		regEx: SimpleSchema.RegEx.Email
	}
});


Schemas.passSchema = new SimpleSchema({
	oldPass: {
		type: String
	},
	newPass: {
		type: String
	},
	repeatPass: {
		type: String,
		custom: function () {
			if (this.value !== this.field('newPass').value) {
				return "passwordMismatch";
			}
		}
	}
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
Schemas.statisticFilter = new SimpleSchema({
	dateBegin: {
		type: Date,
		optional: true,
		autoform: {
			type: "bootstrap-datepicker"
		}
	},
	dateEnd: {
		type: Date,
		optional: true,
		autoform: {
			type: "bootstrap-datepicker"
		}
	},
	showCharts: {
		type: String,
		autoform: {
			type: "select-radio-inline",
			options: function () {
				return [
					{ label: "по городам", value: "city" },
					{ label: "по странам", value: "country" },
					{ label: "топ активных", value: "best" },
					{ label: "топ неактивных", value: "worst" }
				];
			}
		}
	},
	roles: {
		type: String,
		optional: true,
		autoform: {
			type: "select-checkbox-inline",
			options: function () {
				return [
					{ label: "Клиенты", value: "clients" },
					{ label: "Партнеры", value: "partners" }
				];
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
	  label: "Название блока"
  }
});
Schemas.businessSchema = new SimpleSchema({
	label: {
		type: String,
		label: "Название компании",
		max: 200
	},
	actionSphere: {
		type: String,
		label: "Сфера деятельности"
	},
	info: {
		type: String,
		label: "Информация о компании"
	},
	inn: {
		type: Number,
		label: "ИНН"
	},
	ogrn: {
		type: Number,
		label: "ОГРН"
	}
});
Schemas.businessColection = new SimpleSchema({
	'inn': {
		type: Number,
		optional: true
	},
	'info': {
		type: String
	}

});
Schemas.schedule = new SimpleSchema({
	'monday': {
		type: String,
		optional: true
	},
	'tuesday': {
		type: String,
		optional: true
	},
	'wednesday': {
		type: String,
		optional: true
	},
	'thursday': {
		type: String,
		optional: true
	},
	'friday': {
		type: String,
		optional: true
	},
	'saturday': {
		type: String,
		optional: true
	},
	'sunday': {
		type: String,
		optional: true
	}
});
