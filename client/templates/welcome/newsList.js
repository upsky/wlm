Template.newsList.helpers({
	newsList: {
		blockId: "newsList"
	},
	news: function () {
		a = Session.get('newsList');
		log.trace(a && a.length);
		return a;
	}

});
