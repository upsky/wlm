Template.oauthPage.onCreated(function () {
	this.autorun(function () {
		if (Session.get('oauth') != undefined && Session.get('oauth') != 'error')
			window.location.replace(Session.get('oauth'))
	})
});

Template.oauthPage.helpers({
	check: function () {
		return Session.get('oauth') ? Session.get('oauth') !== 'error' : true;
	}
});

Template.layoutOauth.helpers({
	bg: function () {
		if (Session.get('oauth')) {
			return Session.get('oauth') == 'error' ? 'bg-danger' : 'bg-success'
		}
		return 'bg-warning'
	},

	fa: function () {
		if (Session.get('oauth')) {
			return Session.get('oauth') == 'error' ? 'fa-times' : 'fa-check'
		}
		return 'fa-exclamation'
	},

	headerText: function () {
		if (Session.get('oauth')) {
			if (Session.get('oauth') === 'error') {
				return 'Войти в систему не удалось'
			} else {
				var name = Meteor.user().profile.fullName || Meteor.user().profile.name;
				return 'Вы успешно вошли в систему как - ' + name;
			}
		} else {
			return 'Подождите, идет загрузка'
		}
	},

	text: function () {
		if (Session.get('oauth')) {
			return Session.get('oauth') == 'error' ? 'С этой проблемой позвоните на горячую линию: 8-987-22-66-800 или 8-843-22-66-800' : 'Подождите, идет загрузка'
		} else {
			return 'Загрузка..'
		}
	}
});
