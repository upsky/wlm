WlmAdminSeeUsers = {
	check:function(){
		if (!Roles.userIsInRole(Meteor.user(),['adminPanelUsers'])) {
				Router.go('forbidden');
		}
	},
	data: {
		list: [],
		allCount: 0,
		nowPage: 1,
		itemsPage: 10,
		queryString: ""
	},
	reactive: new Meteor.Collection(null),
	get: function () {
		return WlmAdminSeeUsers.reactive.findOne();
	},
	update: function () {
		var config = WlmAdminSeeUsers.data;
		var collect = WlmAdminSeeUsers.reactive;
		if (collect.find().count() !== 1) {
			collect.remove({});
			collect.insert(this.data);
		} else {
			var id = collect.findOne()._id;
			collect.update({ _id: id }, this.data);
		}
	},
	find: function (query, page) {
		var config = WlmAdminSeeUsers.data;
		if (query !== undefined) {
			config.queryString = query;
		}
		if (page) {
			config.nowPage = page;
		}
		Meteor.call(
			'adminPanelUsers',
			config.nowPage,
			config.queryString,
			config.itemsPage,
			function (error, result) {
				config.list = result.data;
				config.allCount = result.count;
				CutterPaginator.generate(config.allCount, config.itemsPage, config.nowPage);
				WlmAdminSeeUsers.update();
			}
		);
	}
};

Template.adminPanelUsersFind.helpers({
	adminPanelUsersFind: {
		blockId: "findUsers"
	}
});

Template.adminPanelListItemRole.helpers({
	roleName: function () {
		return "rolesName." + this;
	}
});

Template.adminPanelUsersFind.events({
	"submit form[name=adminPanelUsersFind]": function (e) {
		WlmAdminSeeUsers.check();
		CutterPaginator.onSetPage = function (input) {
			WlmAdminSeeUsers.find(undefined, input.page);
		};
		e.preventDefault();
		var templateData = Template.instance();
		var searchString = templateData.$("[name=searchString]").val();
		WlmAdminSeeUsers.find(searchString, 1);
	}
});
Template.adminPanelTableUsers.helpers({
	"config": function () {
		WlmAdminSeeUsers.check();
		return WlmAdminSeeUsers.reactive.findOne();
	}
});