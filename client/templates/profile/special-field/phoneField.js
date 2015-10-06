var t = Template.phoneField;

t.events({
	'click #sendPhoneVerification': function () {
		alert('1');
	},
	'click #verifiCode': function () {
		alert('1');
	},
	'click #deleteNumber': function () {
		alert('1');
	},
});
t.helpers({
	'disabled': function () {
		return (this.user.profile.phones[0].number === '' ? '' : 'disabled');
	}
})