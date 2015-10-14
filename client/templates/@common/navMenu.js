Template.navMenu.rendered = function () {
	return log.trace('navMenu rendered');
};

Template.navMenuItem.helpers({
	"id_data": function () {
		var templateData = Template.instance().data;
		return templateData.id != undefined ? templateData.id : '';
	},
	"link": function () {
		var templateData = Template.instance().data;
		return templateData.href != undefined ? templateData.href : templateData.name;
	},
	"isRouterLink": function () {
		var templateData = Template.instance().data;
		return templateData.href != '#';
	},
	"textClass": function () {
		var templateData = Template.instance().data;
		return "pageTitles." + templateData.name;
	}
});

Template.navMenu.helpers({
	"iamnavMenu": function () {
		return 'iam navMenu';
	},
	"mainMenuStatus": function () {
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

