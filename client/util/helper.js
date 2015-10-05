Template.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

Template.registerHelper('cordovaDedect', function () {
	return (!Meteor.isCordova ? 'c-cordova' : '');
});
Template.registerHelper('showQr', function () {
	return Meteor.settings.public.showQr || Meteor.isCordova;
});

Meteor.copyToClipboard = function (text) {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
};