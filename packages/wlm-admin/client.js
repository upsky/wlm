WlmAdmin = {
	reactive: new ReactiveVar({
		list: [],
		allCount: 0,
		nowPage: 1,
		itemsPage: 10,
		queryString: ""
	}),
	check: function () {
		if (!Roles.userIsInRole(Meteor.user(), ['adminPanelUsers']))
			Router.go('forbidden');
	},
	get: function () {
		return this.reactive.get();
	},
	set:function(data){
		this.reactive.set(data);
	},
	update: function () {
		this.reactive.dep.changed();
	},
	find: function (query, page) {
		this.check();
		var config = this.get();
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
				if (!error) {
					var config = WlmAdmin.get();
					config.list = result.data;
					config.allCount = result.count;
					CutterPaginator.generate('adminPanelUsers', config.allCount, config.itemsPage, config.nowPage);
					WlmAdmin.update();
				}
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
		WlmAdmin.check();
		CutterPaginator.get('adminPanelUsers').onSetPage = function (input) {
			WlmAdmin.find(undefined, input.page);
		};
		e.preventDefault();
		var templateData = Template.instance();
		var searchString = templateData.$("[name=searchString]").val();
		WlmAdmin.find(searchString, 1);
	}
});

Template.adminPanelTableUsers.helpers({
	config: function () {
		WlmAdmin.check();
		return WlmAdmin.get();
	}
});

Template.adminPanelUserItem.helpers({
	isImpersonateButton: function () {
		return this.roles.some(function (item) {
			if (item == 'partner' ||
				item == 'client' ||
				item == 'bussines') {
				return true;
			}
		});
	}
});