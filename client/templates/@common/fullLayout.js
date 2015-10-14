Template.fullLayout.rendered = function () {
	if (!Meteor.proton) {
		Meteor.proton = {};
	}
	Meteor.proton.common = {
		build: function () {
			var resizeEnd, resizeThrottleBuffer;
			Meteor.proton.common.events();
			resizeEnd = void 0;
			resizeThrottleBuffer = 50;
			$(window).resize(function () {
				clearTimeout(resizeEnd);
				return resizeEnd = setTimeout(function () {
					return Meteor.proton.common.onResizeEnd();
				}, resizeThrottleBuffer);
			});
			return setTimeout((function () {
				$(".sidebar, .wrapper").addClass("animated fadeInUp");
				return setTimeout((function () {
					return $(".sidebar, .wrapper").removeClass("animated fadeInUp").css("opacity", "1");
				}), 1050);
			}), 50);
		},
		events: function () {
			$(document).on("touchmove", function (event) {
				return event.preventDefault();
			});
			$("body").on("touchmove", ".scrollable, nav", function (event) {
				return event.stopPropagation();
			});
			return $("body").on("touchstart", ".scrollable", function (event) {
				if (event.currentTarget.scrollTop === 0) {
					return event.currentTarget.scrollTop = 1;
				} else {
					if (event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.offsetHeight) {
						return event.currentTarget.scrollTop -= 1;
					}
				}
			});
		},
		onResizeEnd: function () {
			//!Meteor.proton.userNav || Meteor.proton.userNav.shuffleUserNav();
			//!Meteor.proton.dashboard || Meteor.proton.dashboard.setBlankWidgets();
			//setTimeout((function () {
			//	!(Meteor.proton.graphsStats && Meteor.proton.graphsStats.redrawCharts) || Meteor.proton.graphsStats.redrawCharts();
			//	return !(Meteor.proton.userProfile && Meteor.proton.userProfile.redrawCharts) || Meteor.proton.userProfile.redrawCharts();
			//}), 1000);
			//!Meteor.proton.sidebar || Meteor.proton.sidebar.retractOnResize();
			//return !Meteor.proton.sidebar || Meteor.proton.sidebar.setSidebarMobHeight();
		},
		enableTooltips: function () {
			$(".uses-tooltip").tooltip({
				container: "#body"
			});
			return $(".progress-bar").each(function (index, el) {
				var progress;
				progress = Math.round(parseInt($(this).css("width")) / parseInt($(this).parent().css("width")) * 100) + "%";
				return $(this).tooltip({
					container: "#body",
					title: progress
				});
			});
		}
	};
	Meteor.proton.common.build();
	Meteor.proton.sidebar = {
		build: function () {
			Meteor.proton.sidebar.events();
			!$(".advanced-search").length || Meteor.proton.sidebar.buildAdvancedSearch();
			Meteor.proton.sidebar.retractOnResize();
			Meteor.proton.sidebar.setSidebarMobHeight();
			Meteor.proton.sidebar.buildPageData();
			return !$.jstree || Meteor.proton.sidebar.jstreeSetup();
		},
		buildAdvancedSearch: function () {
			$(".select2").select2();
			return $("input[type=\"radio\"], input[type=\"checkbox\"]").uniform();
		},
		events: function () {
			$(document).on("click", ".sidebar-handle", function (event) {
				event.preventDefault();
				return Meteor.proton.sidebar.toggleSidebar();
			});
			return $(document).on("click", ".btn-advanced-search, .close-advanced-search", function (event) {
				event.preventDefault();
				return Meteor.proton.sidebar.toggleAdvancedSearch();
			});
		},
		toggleAdvancedSearch: function () {
			return $(".sidebar").toggleClass("search-mode");
		},
		toggleSidebar: function () {
			$(".sidebar").toggleClass("extended").toggleClass("retracted");
			$(".wrapper").toggleClass("extended").toggleClass("retracted");
			if ($(".sidebar").is(".search-mode")) {
				Meteor.proton.sidebar.toggleAdvancedSearch();
			}
			if ($(".sidebar").is(".retracted")) {
				$.cookie("protonSidebar", "retracted", {
					expires: 7,
					path: "/"
				});
			} else {
				$.cookie("protonSidebar", "extended", {
					expires: 7,
					path: "/"
				});
			}
			return setTimeout((function () {
				return !(Meteor.proton.graphsStats && Meteor.proton.graphsStats.redrawCharts) || Meteor.proton.graphsStats.redrawCharts();
			}), 1000);
		},
		retractOnResize: function () {
			if ($(".sidebar").is(".extended")) {
				return Meteor.proton.sidebar.toggleSidebar();
			}
		},
		jstreeSetup: function () {
			$.jstree._themes = "./styles/vendor/jstree-theme/";
			return $("#proton-tree").jstree({
				json_data: proton.sidebar.treeJson,
				plugins: ["themes", "json_data", "ui", "crrm"],
				core: {
					animation: 100,
					initially_open: ["proton-lvl-0"]
				},
				themes: {
					theme: "proton"
				}
			}).on("click", "a", function (event) {
				var treeLink;
				treeLink = $(this).attr("href");
				if (treeLink !== "#") {
					document.location.href = $(this).attr("href");
				}
				return false;
			});
		},
		setSidebarMobHeight: function () {
			$(".sidebar").css("max-height", "none");
			return setTimeout((function () {
				var sidebarMaxH;
				sidebarMaxH = $(".sidebar > .panel").height() + 30 + "px";
				return $(".sidebar").css("max-height", sidebarMaxH);
			}), 200);
		},
		doThisLater: function () {
			$(".sidebar .sidebar-handle").on("click", function () {
				return $(".panel, .main-content").toggleClass("retracted");
			});
			if ($.cookie("themeColor") === "light") {
				$("#body").addClass("light-version");
			}
			if ($.cookie("jsTreeMenuNotification") !== "true") {
				$.cookie("jsTreeMenuNotification", "true", {
					expires: 7,
					path: "/"
				});
				return $.pnotify({
					title: "Slide Menu Remembers It's State",
					type: "info",
					text: "Slide menu will remain closed when you browse other pages, until you open it again."
				});
			}
		},
		buildPageData: function () {
			var numSections;
			numSections = $(".section-title").length;
			return $(".section-title").each(function (index, el) {
				var sectionId, sectionTitle;
				if ($(this).is(".preface-title")) {
					return;
				}
				sectionTitle = $.trim($(this).text());
				sectionId = sectionTitle.replace(/\s+/g, "-").toLowerCase();
				$(this).parents(".list-group-item").attr("id", sectionId);
				$("<li role=\"presentation\"><a role=\"menuitem\" tabindex=\"-1\" href=\"#" + sectionId + "\">" + sectionTitle + "</a></li>").appendTo(".breadcrumb-nav .active .dropdown-menu");
				if ((index + 1) !== numSections) {
					return $(".preface p").text($(".preface p").text() + sectionTitle + ", ");
				} else {
					return $(".preface p").text($(".preface p").text().slice(0, -2) + " and " + sectionTitle + ".");
				}
			});
		}
	};
	Meteor.proton.sidebar.build();
	return log.trace("fullLayout rendered");
};

Template.fullLayout.events({
	"click #fullLayout": function (event) {
		return "click #fullLayout";
	},
	"click": function () {
		return Session.set('userMenuStatus', false);
	}
});

Template.quickLaunchBar.helpers({
	navLinks: function () {
		return db.navBars.findOne({
			"path": Session.get('currentPath')
		});
	}
});


