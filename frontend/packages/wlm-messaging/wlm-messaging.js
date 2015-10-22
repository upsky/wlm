// Write your package code here!

Messages = new Meteor.Collection('messages');
MessageSchema = new SimpleSchema({
	_id: {
		type: String
	},
	roomId: {
		type: String
	},
	subject: {
		type: String,
		max: 128
	},
	text: {
		type: String
	}
});

ChatRooms = new Meteor.Collection('rooms');
ChatRoomSchema = new SimpleSchema({
	_id: {
		type: String
	},
	name: {
		type: String
	},
	party: {
		type: [String]
	}
});

Message = function (data) {
	if (!this)
		return new Message(data);

	_.extend(this, data);
};

_.extend(Message.prototype, {});

ChatRoom = function (data) {
	if (!this)
		return new ChatRoom(data);

	_.extend(this, data);
};

_.extend(ChatRoom.prototype, {
	sendMessage: function (subject, message) {
		Meteor.call('sendChatMessage', this._id, subject, message);
	},

	messages: function () {
		return Messages.find({ roomId: this._id });
	}
});

Router.route('/messages/:id', {
	template: 'chatPage'
});