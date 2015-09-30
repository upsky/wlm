var noticeError;

Router.configure({
	layoutTemplate: 'defaultLayout',
	loadingTemplate: 'loading',
	template: 'error',
	progressDebug: true
});

Router.plugin('dataNotFound', {
	notFoundTemplate: 'error'
});

if (Meteor.settings["public"].isDown) {
	Router.route('/', {
		template: 'down'
	});
} else {
	Router.route('/loading', {
		layoutTemplate: 'defaultLayout',
		template: 'loading',
		name: 'loading'
	});
	Router.route('/login', {
		layoutTemplate: 'defaultLayout',
		template: 'login',
		name: 'login'
	});
	Router.route('/recoverpass', {
		layoutTemplate: 'defaultLayout',
		template: 'recoverpass',
		name: 'recoverpass'
	});
	Router.route('/reg/:_id', {
		layoutTemplate: 'defaultLayout',
		template: 'reg',
		name: 'reg',
		data: function () {
			return db.invites.findOne(this.params._id);
		},
		waitOn: function () {
			return Meteor.subscribe('invite', this.params._id);
		}
	});
	Router.route('/regemail/:_id', {
		layoutTemplate: 'defaultLayout',
		template: 'reg',
		name: 'regemail',
		data: function () {
			return db.invites.findOne({'emailHash': this.params._id});
		},
		waitOn: function () {
			return Meteor.subscribe('inviteEmail', this.params._id);
		}
	});
	Router.route('/qr/:_id', {
		layoutTemplate: 'defaultLayout',
		template: 'reg',
		name: 'qr',
		data: function () {
			return db.invites.findOne(this.params._id);
		},
		waitOn: function () {
			return Meteor.subscribe('invite', this.params._id);
		},
		onBeforeAction: function () {
			Meteor.logout();
			Meteor.call('invalidateQr', this.params._id);
			return this.next();
		}
	});
	Router.route('/blocked', {
		layoutTemplate: 'defaultLayout',
		template: 'blocked',
		name: 'blocked'
	});
	Router.route('/', {
		template: 'welcome',
		name: 'index',
		action: function () {
			this.layout('fullLayout');
			return this.render('welcome');
		},
		waitOn: function () {
			return Meteor.subscribe('partnerDoc');
		}
	});
	Router.route('/network', {
		layoutTemplate: 'fullLayout',
		template: 'network',
		name: 'network',
		waitOn: function () {
			Meteor.subscribe('networkData');
			Meteor.subscribe('activeInvites');
			Meteor.subscribe('lastInvites');
			return Meteor.subscribe('partnerDoc');
		}
	});
	Router.route('/profile', {
		layoutTemplate: 'fullLayout',
		name: 'profile',
		template: 'profile'
	});
	Router.route('/qrcode', {
		layoutTemplate: 'fullLayout',
		template: 'inviteCode',
		name: 'qrcode',
		waitOn: function () {
			return Meteor.subscribe('activeInvites');
		}
	});
	Router.route('/support', {
		layoutTemplate: 'fullLayout',
		template: 'support',
		name: 'support'
	});
}

var openUrls = ['login', 'error', 'down', 'loading', 'blocked', 'reg', 'qr', 'recoverpass', 'regemail'];
var checkVerify = function () {
	var flag = false;
	if (Meteor.user()) {
		Meteor.user().emails.forEach(function (item) {
			if (item.verified === true)flag = true;
		});

		if (!flag)
			if (Router.current().route.getName() !== 'profile') {
				if (typeof noticeError !== "undefined")noticeError.remove();

				noticeError = new PNotify({
					text: 'Имейл не подтвержден, передите в <a href="/profile">профиль</a>.',
					type: 'error',
					hide: false,
					addclass: "stack-bar-top",
					width: "100%"
				});
			} else {
				if (typeof noticeError !== "undefined")noticeError.remove();
			}
	}
};

Router.onBeforeAction(
	function (location) {
		console.log('onBeforeAction ' + location.url, Meteor.userId());
		log.trace('onBeforeAction ' + location.url);


		if (Meteor.userId()) {
			checkVerify();
			return this.next();
		}

		if (Meteor.loggingIn()) {
			this.layout('defaultLayout');
			return this.render('loading');
		} else {
			Router.go('login');
		}


	},
	{
		except: openUrls
	}
);
