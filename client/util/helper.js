Template.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

Template.registerHelper('cordovaDedect', function () {
	return (!Meteor.isCordova ? 'c-cordova' : '');
});
Template.registerHelper('showQr', function () {
	return Meteor.settings.public.showQr || Meteor.isCordova;
});
