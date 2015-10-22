UI.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

UI.registerHelper('pageTitle', function () {
	var pageTitle, path;
	path = Router.current().route.getName();
	pageTitle = TAPi18n.__('pageTitles.' + path);
	document.title = pageTitle + ' / ' + TAPi18n.__('pageTitles.topTitle');
	return pageTitle;
});

UI.registerHelper('Session', function (varName) {
	return Session.get(varName);
});