Router.route('/admin/panel/users', {
	layoutTemplate: 'fullLayout',
	template: 'adminPanelUsers',
	name: 'adminPanelUsers',
	onBeforeAction:function(){
		return (Roles.userIsInRole(Meteor.user(),['adminPanelUsers'])) ? this.next() : Router.go('forbidden');
	}
});