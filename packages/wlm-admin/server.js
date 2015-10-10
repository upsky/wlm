Meteor.methods({
	adminUsers: function (nowPage, query, itemsPage) {
		check(itemsPage, Number);
		check(query, String);
		check(nowPage, Number);

		var configRequest = {
			_id: 1,
			createdAt: 1,
			username: 1,
			emails: 1,
			roles: 1,
			uin: 1,
			limit: itemsPage
		};

		if (nowPage && +nowPage > 1) {
			configRequest.skip = (nowPage - 1) * itemsPage;
		}

		var result = {
			data: [],
			count: 0
		};

		var tempRes = {};
		if (query) {
			var findRegExp = {
				username: new RegExp(query)
			};
			tempRes = db.users.find(findRegExp, configRequest);
		} else {
			tempRes = db.users.find({}, configRequest);
		}

		result.data = tempRes.fetch();
		result.count = tempRes.count();
		return result
	}
});
WlmSecurity.addMethods({
	adminUsers: {
		roles: 'adminUsers'
	}
});