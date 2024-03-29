Template.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

Template.registerHelper('cordovaDedect', function () {
	return (!Meteor.isCordova ? 'c-cordova' : '');
});
Template.registerHelper('showQr', function () {
	return Meteor.pubSettings('showQr') || Meteor.isCordova;
});
Template.registerHelper('isCurrentRoute', function (route) {
	return Router.current().route.getName() === route;
});
Meteor.copyToClipboard = function (text) {
	var prompt = Meteor.isCordova ?
		TAPi18n.__('messages.copyToClipboardMobile') :
		TAPi18n.__('messages.copyToClipboard') + ": Ctrl+C, Enter";

	window.prompt(prompt, text);
};