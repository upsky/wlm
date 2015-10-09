Template.addVideo.helpers({
	addVideo:{
		blockId:'settings'
	}
});

Template.addVideo.onRendered(function (argument) {
	if(!_.isEmpty(Session.get('editVideo'))) {
		$('[name=name]').val(Session.get('editVideo'));
		new PNotify({
							title: document.title,
							type: 'success',
							text: TAPi18n.__('messages.videoNotfound')
						});
	}
});

Template.addVideo.events({
	'click [name=back]': function () {
		Session.set('editVideo', undefined);
		Router.go('videoManager');
	}
});

AutoForm.hooks({
	insertVideoForm: {
		onError: function (type, error) {
			if (error.error === 407) {
				return new PNotify({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.checkLink')
				});
			} else{
				return new PNotify({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.notCorrect')
				});
			}
		},
		onSuccess: function (type, result) {
			if (result) {
				Router.go('videoManager');
				new PNotify({
					type: 'success',
					text: TAPi18n.__('messages.addVideo')
				});
			}
		}
	}
});