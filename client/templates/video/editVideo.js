Template.editVideo.onCreated(function () {
	console.log(Template.instance());
});

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
		Router.go('/admin/video/videoManager');
	}
});

AutoForm.hooks({
	insertVideoForm: {
		before: {
			method: function (doc) {
				doc.title = doc.title;
				doc.youtubeId = doc.youtubeId;
				doc._id = Router.current().params._id;
				doc.info = doc.info;
				doc.name = doc.name;
				return doc;
			}
		},
		onError: function (type, error) {
			console.log(error);
			if (error){
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
