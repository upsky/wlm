Template.navMenuItem.helpers({
	link: function () {
		return this.href ? this.href : this.name;
	},
	isRouterLink: function () {
		return this.href !== '#';
	},
	title: function () {
		return 'pageTitles.' + this.name;
	},
	
	rolePresent: function () {
		return this.role ? Roles.userIsInRole(Meteor.userId(), this.role) : true;
	}
});

Template.navMenu.helpers({
	mainMenuStatus: function () {
		if (Session.get('userMenuStatus')) {
			return 'expanded';
		} else {
			return '';
		}
	}
});

Template.navMenu.events({
	"click #navMenu": function (event) {
		return log.trace('click #navMenu');
	},
	"click #logoutHref": function (event) {
		Meteor.defer(function () {
			Router.go('logout')
		});
	},
	"click #disconnect": function (event) {
		Impersonate.undo();
	}
});

