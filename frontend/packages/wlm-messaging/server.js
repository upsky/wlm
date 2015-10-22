/**
 * Created by kriz on 16/10/15.
 */


Meteor.publish('chatMessages', function (toId, offset) {
	check(this.userId, String);
	check(toId, String);
	check(offset, Number);

	var fromId = this.userId;
	offset = offset > 0 ? offset : 0;

	var room = ChatRooms.findOne({
		party: { $all: [fromId, toId] }
	});
	check(room, Object);

	var messages = Messages.find(
		{ roomId: room._id },
		{ offset: offset, limit: 50 });

	var chatRoom = ChatRooms.find(roomId);

	return [ messages, chatRoom];
});

Meteor.methods({
	createChatRoom: function (toId) { // TODO check toId to avoid chat rooms creating
		check(this.userId, String);
		check(toId, String);

		ChatRooms.insert({
			name: toId,
			party: [this.userId, toId]
		});
	},

	sendChatMessage: function (roomId, subject, text) {
		check(this.userId, String);
		check(roomId, String);
		check(subject, String);
		check(text, String);

		var room = ChatRooms.findOne(roomId);
		check(room, Object);

		var name = Meteor.user().profile.name || this.userId;

		var message = {
			roomId: roomId,   // TODO check toId, add message type (to business, client-client, etc_
			subject: subject,
			text: text,

			name: name,
			fromId: this.userId,
			created: new Date
		};

		Messages.insert(message);
	}
});

WlmSecurity.addPublish({
	chatMessages: { roles: 'all' }
});
WlmSecurity.addMethods({
	createChatRoom: { roles: 'all' },
	sendChatMessage: { roles: 'all' }
});
