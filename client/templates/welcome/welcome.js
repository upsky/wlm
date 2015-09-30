var getNews, loadWall, vkNewsInit;
var BR = '<br>';


var vkInit = function () {
	VK.init({
		apiId: Meteor.settings.public.vk.appId,
		onlyWidgets: true
	});
};

vkNewsInit = function () {
	if (!window.vkAsyncInit) {
		$.getScript("//vk.com/js/api/openapi.js");
		return window.vkAsyncInit = function () {
			vkInit();
			return _.defer(function () {
				return getNews();
			});
		};
	} else {
		return getNews();
	}
};

loadWall = function (wall) {
	return VK.api(
		"wall.get",
		{
			domain: wall,
			filter: "owner",
			count: 15,
			https: 1,
			v: "5.24"
		},
		function (data) {
			for (var i in data.response.items) {
				var item = data.response.items[i];
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
			}
			return Session.set('newsList', data.response.items);
		});
};

getNews = function () {
	return loadWall('wlmarket_official');
};

Template.welcome.rendered = function () {
	return vkNewsInit();
};

Template.welcome.events({
	"click #vkReload": function (event) {
		return VK.Auth.login(function (response) {
			vkInit();
			return _.defer(function () {
				return getNews();
			});
		});
	}
});
