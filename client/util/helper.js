Template.registerHelper('isCordova', function () {
	return Meteor.isCordova;
});

Template.registerHelper('cordovaDedect', function () {
	return (!Meteor.isCordova ? 'c-cordova' : '');
});