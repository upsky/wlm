Router.route('/admin/panel/users', {
	layoutTemplate: 'fullLayout',
	template: 'adminUsers',
	name: 'adminUsers',
	onBeforeAction: function () {
		if (Roles.userIsInRole(Meteor.user(), 'adminUsers'))
			this.next();
		else
			Router.go('forbidden');
	}
});
Router.route('/admin/user/impersonate:_id', {
	name: 'impersonate',
	template: 'loading',
	waitOn: function () {
		//todo  права что-же с вами делать...
		//if (Roles.userIsInRole(Meteor.user(),'adminUsers'))
		//	this.next();
		//else
		// 	Router.go('forbidden');
		if (this.params._id) {
			Impersonate.do(this.params._id);
			Router.go('index');
		}
	}
});