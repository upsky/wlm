Template.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

Template.registerHelper('cordovaDedect', function () {
	return (!Meteor.isCordova ? 'c-cordova' : '');
});
Template.registerHelper('showQr', function () {
	console.log('Meteor.settings.showQr', Meteor.settings.showQr);
	return Meteor.settings.showQr;
});
