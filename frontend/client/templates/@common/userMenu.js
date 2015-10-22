Template.userMenu.rendered = function () {
	Session.set('userMenuStatus', false);
	if (!Meteor.proton) {
		Meteor.proton = {};
	}
	Meteor.proton.userNav = {
		build: function () {
			Meteor.proton.userNav.events();
			Meteor.proton.userNav.shuffleUserNav();
			return setTimeout((function () {
				return Meteor.proton.userNav.bounceCounter();
			}), 3000);
		},

		events: function () {
			$(document).on("click", ".user-menu-wrapper a", function (event) {
				var viewToToggle;
				viewToToggle = $(this).attr("data-expand");
				if ($(this).is(".unread")) {
					$(this).removeClass("unread");
					$(this).find(".menu-counter").fadeOut("100", function () {
						return $(this).remove();
					});
				}
				$("nav.main-menu").removeClass("expanded");
				$(".main-menu-access").removeClass("active");
				$("nav.user-menu > section .active").not(this).removeClass("active");
				$(this).toggleClass("active");
				$(".nav-view").not(viewToToggle).fadeOut(60);
				setTimeout((function () {
					return $(viewToToggle).fadeToggle(60);
				}), 60);
				return false;
			});

			$(document).on("click", ".close-user-menu", function (event) {
				$("nav.user-menu > section .active").removeClass("active");
				return $(".nav-view").fadeOut(30);
			});

			$(document).on("click", ".theme-view li", function (event) {
				var $body = $("#body");
				var theme = $(this).attr("data-theme");
				$body.removeClass(function (index, css) {
					return (css.match(/\btheme-\S+/g) || []).join(" ");
				});
				$.cookie("protonTheme", theme, {
					expires: 7,
					path: "/"
				});
				if (theme === "default") {
					return;
				}
				$body.addClass(theme);
			});
		},
		shuffleUserNav: function () {
		},

		bounceCounter: function () {
			var $menu = $(".menu-counter");

			if (!$menu.length) { return; }

			$menu.toggleClass("animated bounce");

			setTimeout((function () {
				return $menu.toggleClass("animated bounce");
			}), 1000);

			setTimeout((function () {
				return Meteor.proton.userNav.bounceCounter();
			}), 5000);
		}
	};
	return Meteor.proton.userNav.build();
};

Template.userMenu.helpers({
	userTitle: function () {
		var user = Meteor.user();

		if (user) {
			return Meteor._get(user, 'profile', 'name') || user.username;
		} else {
			return log.warn("Meteor.user() undefined");
		}
	},

	userMenuStatus: function () {
		return Session.get('userMenuStatus') ? 'active' : '';
	}
});

Template.userMenu.events({
	"click #userMenu": function (event) {
		return 'click #userMenu';
	},
	"click .toggle-main-menu": function (event) {
		event.stopPropagation();
		return Session.set('userMenuStatus', !Session.get('userMenuStatus'));
	}
});
