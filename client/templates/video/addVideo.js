Template.addVideo.helpers({
	addVideo:{
		blockId:'settings'
	},
	buttonName: function () {
		if (!_.isEmpty(Template.instance().data)) {
			return TAPi18n.__('buttons.edit')
		} else {
			return TAPi18n.__('buttons.add')
		}
	}
});

Template.addVideo.onRendered(function () {
	var data = Template.instance().data;
	if (!_.isEmpty(data)) {
		$('[name=title]').val(data.title);
		$('[name=youtubeId]').val(data.youtubeId);
		$('[name=info]').val(data.info);
		$('[name=_id]').val(data._id);
		$('[name=_id]').attr('readonly', 'readonly');
	} else if (!_.isEmpty(Session.get('editVideo'))) {
		$('[name=_id]').val(Session.get('editVideo'));
		$('[name=_id]').attr('readonly', 'readonly');
		WlmNotify.create({
							title: document.title,
							type: 'success',
			text: TAPi18n.__('messages.videoNotFound')
						});
	}
});

Template.addVideo.events({
	'click [name=back]': function () {
		Session.set('editVideo', undefined);
		if (!_.isEmpty(Session.get('route'))) {
			Router.go(Session.get('route'));
			Session.set('route', undefined);
		} else {
			Router.go('videoManager');
		}
	}
});

AutoForm.hooks({
	insertVideoForm: {
		onError: function (type, error) {
			if (error.error === 407) {
				return WlmNotify.create({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.checkLink')
				});
			} else if (error.error === 500) {
				return WlmNotify.create({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.videoUsed')
				});
			} else {
				return WlmNotify.create({
					title: document.title,
					type: 'error',
					text: TAPi18n.__('errors.notCorrect')
				});
			}
		},
		onSuccess: function (type, result) {
			if (result.find) {
				delete result.find;
				Meteor.call('editVideos', result, function (error) {
					if (error) {
						console.log(error);
					}
				});
			} else {
				delete result.find;
				Meteor.call('insertVideos', result, function (error) {
					if (error) {
						console.log(error);
					}
				});
			}
			if (!_.isEmpty(Session.get('route'))) {
				Router.go(Session.get('route'));
			} else {
				Router.go('videoManager');
			}
		}
	}
});