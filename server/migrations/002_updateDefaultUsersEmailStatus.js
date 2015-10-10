Migrations.add({
	version: 2,
	name: 'update Default Users Email Status',
	up: function () {
		verifyEmail('root@wlm.ru');
		verifyEmail(Meteor.pubSettings('email', 'sysadmin'));
		verifyEmail('partner@wlm.ru');
	}
});
