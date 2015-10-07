Router.route('/admin/panel/users', {
	layoutTemplate: 'fullLayout',
	template: 'adminPanelUsers',
	name: 'adminPanelUsers',
	onBeforeAction:function(){
		return (Roles.userIsInRole(Meteor.user(),['adminPanelUsers'])) ? this.next() : Router.go('forbidden');
	}
});
Router.route('/wh/:_id', {
	name: 'wh',
	template: 'loading',
	waitOn: function () {
		//todo  права что-же с вами делать...
		//return (Roles.userIsInRole(Meteor.user(),['adminPanelUsers'])) ? this.next() : Router.go('forbidden');
		if (this.params._id) {
			Impersonate.do(this.params._id);
			Router.go('index');
		}
	}
});