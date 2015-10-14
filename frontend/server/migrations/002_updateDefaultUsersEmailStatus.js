Migrations.add({
	version: 2,
	name: 'update Default Users Email Status',
	up: function () {
		WlmUtils.verifyEmail('root@wlm.ru');
		WlmUtils.verifyEmail(Meteor.pubSettings('email', 'sysadmin'));
		WlmUtils.verifyEmail('partner@wlm.ru');
	}
});
