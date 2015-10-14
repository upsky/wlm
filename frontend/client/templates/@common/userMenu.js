Template.userMenu.rendered = function() {
  Session.set('userMenuStatus', false);
  if (!Meteor.proton) {
    Meteor.proton = {};
  }
  Meteor.proton.userNav = {
    build: function() {
      Meteor.proton.userNav.events();
      Meteor.proton.userNav.shuffleUserNav();
      return setTimeout((function() {
        return Meteor.proton.userNav.bounceCounter();
      }), 3000);
    },
    events: function() {
      $(document).on("click", ".user-menu-wrapper a", function(event) {
        var viewToToggle;
        viewToToggle = $(this).attr("data-expand");
        if ($(this).is(".unread")) {
          $(this).removeClass("unread");
          $(this).find(".menu-counter").fadeOut("100", function() {
            return $(this).remove();
          });
        }
        $("nav.main-menu").removeClass("expanded");
        $(".main-menu-access").removeClass("active");
        $("nav.user-menu > section .active").not(this).removeClass("active");
        $(this).toggleClass("active");
        $(".nav-view").not(viewToToggle).fadeOut(60);
        setTimeout((function() {
          return $(viewToToggle).fadeToggle(60);
        }), 60);
        return false;
      });
      $(document).on("click", ".close-user-menu", function(event) {
        $("nav.user-menu > section .active").removeClass("active");
        return $(".nav-view").fadeOut(30);
      });
      return $(document).on("click", ".theme-view li", function(event) {
        var theme;
        theme = $(this).attr("data-theme");
        $("#body").removeClass(function(index, css) {
          return (css.match(/\btheme-\S+/g) || []).join(" ");
        });
        $.cookie("protonTheme", theme, {
          expires: 7,
          path: "/"
        });
        if (theme === "default") {
          return;
        }
        return $("#body").addClass(theme);
      });
    },
    shuffleUserNav: function() {},
    bounceCounter: function() {
      if (!$(".menu-counter").length) {
        return;
      }
      $(".menu-counter").toggleClass("animated bounce");
      setTimeout((function() {
        return $(".menu-counter").toggleClass("animated bounce");
      }), 1000);
      return setTimeout((function() {
        return Meteor.proton.userNav.bounceCounter();
      }), 5000);
    }
  };
  return Meteor.proton.userNav.build();
};

Template.userMenu.helpers({
  iamuserMenu: function() {
    return 'iam userMenu';
  },
  userTitle: function() {
    var name, ref;
    if (Meteor.user()) {
      name = Meteor.user().username;
      if (((ref = Meteor.user().profile) != null ? ref.name : void 0) != null) {
        name = Meteor.user().profile.name + ' ' + name;
      }
      return name;
    } else {
      return log.warn("Meteor.user() undefined");
    }
  },
  "userMenuStatus": function() {
    if (Session.get('userMenuStatus')) {
      return 'active';
    } else {
      return '';
    }
  }
});

Template.userMenu.events({
  "click #userMenu": function(event) {
    return 'click #userMenu';
  },
  "click .toggle-main-menu": function (event) {
    event.stopPropagation();
    return Session.set('userMenuStatus', !Session.get('userMenuStatus'));
  }
});
