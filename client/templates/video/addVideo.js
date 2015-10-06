Template.addVideo.helpers({
	addVideo:{
		blockId:'settings'
	}
});

Template.addVideo.events({
	'click [name=back]': function () {
		Router.go('/admin/video/videoManager');
	}
});

AutoForm.hooks({
	insertVideoForm: {
		onError: function (type, error) {
			console.log(type, error);
			if (error) {
				return new PNotify({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.notCorrect')
				});
			}
		},
		onSuccess: function (type, result) {
			if (result) {
				Router.go('/admin/video/videoManager');
			}
		}
	}
});
