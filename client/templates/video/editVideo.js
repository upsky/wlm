Template.editVideo.helpers({
	editVideo:{
		blockId:'settings'
	},
	videos: function() {
	  return db.videos.findOne(Template.instance().data._id);
	}
});

Template.editVideo.events({
	'click [name=back]': function () {
		if (!_.isEmpty(Session.get('route'))) {
			Router.go(Session.get('route'));
		} else {
			Router.go('videoManager');
		}
	}
});

AutoForm.hooks({
	insertVideoForm: {
		before: {
			method: function (doc) {
				doc._id = Router.current().params._id;
				return doc;
			}
		},
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
				if (!_.isEmpty(Session.get('route'))) {
					Router.go(Session.get('route'));
				} else {
					Router.go('videoManager');
				}
				new PNotify({
					type: 'success',
					text: TAPi18n.__('messages.addVideo')
				});
			}
		}
	}
});
