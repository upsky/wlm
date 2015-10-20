/**
 * Created by kriz on 16/10/15.
 */

Template.chatPage.helpers({
	toId: function () {
		return Router.current().params.id;
	}
});

Template.chatClient.onCreated(function () {
	var toId = this.data.toId;
	this.subscribe('chatMessages', toId, 0);
});

Template.chatClient.onRendered(function () {
	var self = this;
	this.autorun(function () {
		Messages.find().count();
		var $panel = self.$('.panel-body');
		$panel.scrollTop(Number.MAX_VALUE);
	});
});


Template.chatClient.helpers({
	messages: function () {
		var fromId = Meteor.userId();
		var toId = this.toId;

		return Messages.find({
			$or: [
				{ fromId: toId, toId: fromId },
				{ fromId: fromId, toId: toId }
			]
		});
	},

	chatName: function () {
		return 'Chat with ' + this.toId;
	}
});

Template.chatClient.events({
	'submit #send-chat-message': function (evt) {
		evt.preventDefault();

		var i = Template.instance();
		var $message = i.$('#chat-message');

		var message = $message.val();
		$message.val('');

		Meteor.call('sendChatMessage', i.data.toId, '', message);
	}
});

//==============================================================
// Chat message
//==============================================================
Template.chatMessage.helpers({
	isMine: function (then, els) {
		return this.fromId === Meteor.userId() ? then : els;
	},
	userName: function () {
		return this.name || this.fromId;
	},
	timeAgo: function () {
		return moment(this.created).format('HH:MM');
	}
});