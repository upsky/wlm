// Write your package code here!

Messages = new Meteor.Collection('messages');
ChatRooms = new Meteor.Collection('rooms');

Message = function (data) {
	if (! this)
		return new Message(data);

	_.extend(this, data);
};

_.extend(Message.prototype, {

});

ChatRoom = function (data) {
	if (! this)
		return new ChatRoom(data);

	_.extend(this, data);
};

_.extend(ChatRoom.prototype, {
	sendMessage: function (subject, message) {
		Meteor.call('sendMessage', this._id, subject, message);
	},

	messages: function () {
		return Messages.find({ roomId: this._id });
	}
});

Router.route('/messages/:id', {
	template: 'chatPage'
});