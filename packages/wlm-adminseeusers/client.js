WlmAdminSeeUsers = {
	check: function () {
		if (!Roles.userIsInRole(Meteor.user(), ['adminPanelUsers']))
			Router.go('forbidden');
	},
	data: {
		list: [],
		allCount: 0,
		nowPage: 1,
		itemsPage: 10,
		queryString: ""
	},
	reactive: new ReactiveVar({}),
	get: function () {
		return WlmAdminSeeUsers.reactive.get();
	},
	update: function () {
		WlmAdminSeeUsers.reactive.set(WlmAdminSeeUsers.data);
	},
	find: function (query, page) {
		WlmAdminSeeUsers.check();
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
				CutterPaginator.generate('adminPanelUsers',config.allCount, config.itemsPage, config.nowPage);
				WlmAdminSeeUsers.update();
			}
		);
	}
};

Template.adminPanelUsersFind.helpers({
	blockInfo: {
		blockId: "findUsers"
	}
});

Template.adminPanelListItemRole.helpers({
	roleName: function () {
		return "rolesName." + this;
	}
});

Template.adminPanelUsersFind.events({
	"submit form#adminPanelUsersFind": function (e) {
		WlmAdminSeeUsers.check();
		CutterPaginator.get('adminPanelUsers').onSetPage = function (input) {
			WlmAdminSeeUsers.find(undefined, input.page);
		};
		e.preventDefault();
		var templateData = Template.instance();
		var searchString = templateData.$("[name=searchString]").val();
		WlmAdminSeeUsers.find(searchString, 1);
	}
});

Template.adminPanelTableUsers.helpers({
	config: function () {
		WlmAdminSeeUsers.check();
		return WlmAdminSeeUsers.get();
	}
});

Template.adminPanelUserItem.helpers({
	isImpersonateButt: function () {
		return this.roles.some(function (item) {
			if (item == 'partner' ||
				item == 'client' ||
				item == 'bussines') {
				return true;
			}
		});
	}
});