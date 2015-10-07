Meteor.methods({
	adminPanelUsers:function(beginItem,query,adminUserFindItemsPage){
		check(adminUserFindItemsPage,Number);
		check(query,String);
		check(beginItem,Number);

		var configRequest = {
			"_id": 1,
			"createdAt": 1,
			"username": 1,
			"emails": 1,
			"roles": 1,
			"uin":1,
			"limit":adminUserFindItemsPage
		};

		if (beginItem && +beginItem > 1)
		{
			configRequest["skip"] = +(beginItem - 1) * +adminUserFindItemsPage;
		}
		var result = {
			data:{},
			count:0
		};
		var tempRes ={};
		if (query)
		{
			var findRegExp={
				"username": new RegExp(query)
			};
			tempRes = db.users.find(findRegExp,configRequest);
		}else
		{
			tempRes = db.users.find({},configRequest);
		}
		result.data = tempRes.fetch();
		result.count = tempRes.count();
		return result;
	}
});
/*  при использовании крашится
WlmSecurity.addMethods({
	adminPanelUsers: {
		authNotRequired:false,
		roles: 'adminPanelUsers'
	}
});*/

WlmSecurity._methods.adminPanelUsers= {
	authNotRequired:false,
	roles: 'adminPanelUsers'
	};
