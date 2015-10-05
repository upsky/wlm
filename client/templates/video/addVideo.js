Template.addVideo.helpers({
	addVideo:{
		blockId:'settings'
	}
});

Template.addVideo.events({
	'click [name=back]': function () {
		Router.go('/videoManager');
	}
});

AutoForm.hooks({
	insertVideoForm: {
		onSuccess: function (type, result) {
			if (result) {
				Router.go('/videoManager');
			}
		}
	}
});
