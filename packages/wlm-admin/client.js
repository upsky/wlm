WlmAdmin = {
	reactive: new ReactiveVar({
		list: [],
		allCount: 0,
		nowPage: 1,
		itemsPage: 10,
		queryString: ""
	}),
	check: function () {
		if (!Roles.userIsInRole(Meteor.user(), ['adminUsers']))
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
			config.queryString = query.trim();
		}
		if (page) {
			config.nowPage = page;
		}
		Meteor.call(
			'adminUsers',
			config.nowPage,
			config.queryString,
			config.itemsPage,
			function (error, result) {
				if (!error) {
					var config = WlmAdmin.get();
					config.list = result.data;
					config.allCount = result.count;
					CutterPaginator.generate('adminUsers', config.allCount, config.itemsPage, config.nowPage);
					WlmAdmin.update();
				}
			}
		);
	}
};

Template.adminUsersFind.helpers({
	blockInfo: {
		blockId: "findUsers"
	}
});

Template.adminPanelListItemRole.helpers({
	roleName: function () {
		return "rolesName." + this;
	}
});

Template.adminUsersFind.events({
	"submit form#adminUsersFind": function (e) {
		WlmAdmin.check();
		CutterPaginator.get('adminUsers').onSetPage = function (input) {
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
		if (this.roles && this.roles.length > 0) {
			return this.roles.some(function (item) {
				if (item == 'partner' ||
					item == 'client' ||
					item == 'bussines') {
					return true;
				}
			});
		}
	}
});