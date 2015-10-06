var BR = '<br>';

var vkInit = function () {
	VK.init({
		apiId: Meteor.settings.public.vk.appId,
		onlyWidgets: true
	});
	VK.Auth.getLoginStatus(function getStatus (status) {
		console.log('status', status);
		if (status.status != 'loaded') {
			//VK.Auth.getLoginStatus(getStatus);
		}
	})
};

var vkNewsInit = function () {
	if (!window.vkAsyncInit) {
		window.vkAsyncInit = true;
		$.getScript("//vk.com/js/api/openapi.js", function () {
			vkInit();
			return _.defer(function () {
				return getNews();
			})
		});
	} else {
		return getNews();
	}
};

var loadWall = function (wall) {
	VK.api(
		"wall.get",
		{
			domain: wall,
			filter: "owner",
			count: 15,
			https: 1,
			v: "5.24"
		},
		function (data) {
			var items = _.map(data.response.items, function (item) {
				item.jsDate = new Date(item.date * 1000);
				if (item.copy_history) {
					item.text = [item.text, item.copy_history[0].text, ''].join(BR);
				}

				if (item.attachments && item.attachments.length > 0) {
					var attachment = item.attachments[0];
					switch (attachment.type) {
						case 'video':
							var video = attachment.video;
							item.text = video.title + BR + item.text;
							item.img = video.photo_320;
							item.href = '//vk.com/video' + video.owner_id + '_' + video.id;
							break;
						case 'photo':
							var photo = attachment.photo;
							item.img = photo.photo_604;
							item.href = '//vk.com/photo' + photo.owner_id + '_' + photo.id;
							break;
					}
				}
				item.text = item.text
					.replace(/(?:\r\n|\r|\n)/g, BR)
					.replace(/#[\wа-яА-Я\d_]{1,}/g, "")
					.replace(/(https?:[^\s<]+)/g, '<a href="$1">$1</a>');

				return item;
			});
			return Session.set('newsList', items);
		});
};

var getNews = function () {
	return loadWall(Meteor.settings.public.vk.groupName);
};

Template.newsList.onRendered(function () {
	return vkNewsInit();
});

Template.newsList.events({
	"click #vkReload": function (event) {
		return VK.Auth.login(function (response) {
			vkInit();
			return _.defer(function () {
				return getNews();
			});
		});
	}
});



Template.newsList.helpers({
	newsList: {
		blockId: "newsList"
	},
	news: function () {
		a = Session.get('newsList');
		log.trace(a && a.length);
		return a;
	}

});
