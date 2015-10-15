var noticeError;

Router.configure({
	layoutTemplate: 'defaultLayout',
	loadingTemplate: 'loading',
	template: 'error',
	progressDebug: true,
	waitOn: function() {
			return Meteor.subscribe('videos');
	}
});

Router.plugin('dataNotFound', {
	notFoundTemplate: 'error'
});

if (Meteor.pubSettings('isDown')) {
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
		layoutTemplate: 'loginLayout',
		template: 'login',
		name: 'login'
	});
	Router.route('/logout', {
		layoutTemplate: 'loginLayout',
		template: 'logout',
		name: 'logout',
		action: function () {
			Meteor.logout();
			Router.go('login');
		}
	});

	Router.route('/recoverpass', {
		layoutTemplate: 'loginLayout',
		template: 'recoverpass',
		name: 'recoverpass'
	});
	Router.route('/reg/:_id', {
		layoutTemplate: 'loginLayout',
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
		layoutTemplate: 'loginLayout',
		template: 'reg',
		name: 'regemail',
		data: function () {
			return db.invites.findOne({ 'emailHash': this.params._id });
		},
		waitOn: function () {
			return Meteor.subscribe('inviteEmail', this.params._id);
		}
	});
	Router.route('/qr/:_id', {
		layoutTemplate: 'loginLayout',
		template: 'reg',
		name: 'qr',
		data: function () {
			var invite = db.invites.findOne(this.params._id);
			if (invite) invite.email = '';
			return invite;
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
			return [
				Meteor.subscribe('networkData'),
				Meteor.subscribe('activeInvites'),
				Meteor.subscribe('lastInvites'),
				Meteor.subscribe('partnerDoc')
			]
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
	Router.route('/admin/video', {
		layoutTemplate: 'fullLayout',
		template: 'videoManager',
		name: 'videoManager'
	});
	Router.route('/admin/video/edit/:_id', {
		layoutTemplate: 'fullLayout',
		template: 'addVideo',
		name: 'editVideo',
		data: function () {
			return db.videos.findOne({ _id: this.params._id })
		}
	});
	Router.route('/admin/video/add', {
		layoutTemplate: 'fullLayout',
		template: 'addVideo',
		name: 'addVideo'
	});
	Router.route('/forbidden',{
		layoutTemplate: 'defaultLayout',
		template: 'forbidden',
		name: 'forbidden'
	});
	Router.route('/statistic', {
		layoutTemplate: 'fullLayout',
		template: 'highcharts',
		name: 'highcharts'
	});
	Router.route('/admin/panel', {
		layoutTemplate: 'fullLayout',
		template: 'adminPanel',
		name: 'adminPanel',
		onBeforeAction:function(){
			if (Roles.userIsInRole(Meteor.user(),'adminPanel'))
				this.next();
			else
				Router.go('forbidden');
		}
	});
}

var errorNotice;
var checkVerify = function () {
	var flag = false;
	if (Meteor.user()) {
		Meteor.user().emails.forEach(function (item) {
			if (item.verified === true)flag = true;
		});
		if (!flag)
			if (Router.current().route.getName() !== 'profile') {
				errorNotice = errorNotice || WlmNotify.create({
						group: 'emailVerify',
						text: 'messages.emailNotVerified',
						type: 'warning',
						hide: false,
						addclass: "stack-bar-top"
					});
			} else {
				errorNotice && errorNotice.close();
				errorNotice = undefined;
			}
	}
};

var openUrls = ['login', 'error', 'forbidden', 'down', 'loading', 'blocked', 'reg', 'qr', 'recoverpass', 'regemail', 'logout'];
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