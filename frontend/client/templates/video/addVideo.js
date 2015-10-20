Template.addVideo.helpers({
	addVideo: {
		blockId: 'settings'
	},
	videos: function () {
		if (!!Template.instance().data) {
			return db.videos.findOne(Template.instance().data._id);
		}
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
		history.go(-1);
	}
});

AutoForm.hooks({
	insertVideoForm: {
		onError: function (type, error) {
			console.log(error);
			if (_.contains([407, 501], error.error)) {
				return WlmNotify.create({
					title: document.title,
					type: 'error',
					text: TAPi18n.__(error.reason)
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
			history.go(-1);
		}
	}
});