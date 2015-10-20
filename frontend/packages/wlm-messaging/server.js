/**
 * Created by kriz on 16/10/15.
 */


Meteor.publish('chatMessages', function (toId, offset) {
	check(this.userId, String);
	check(toId, String);
	check(offset, Number);

	var fromId = this.userId;
	offset = offset > 0 ? offset : 0;
	return Messages.find({ $or: [
		{ fromId: toId, toId: fromId },
		{ fromId: fromId, toId: toId }
	] }, { offset: offset, limit: 50 });
});

Meteor.methods({
	sendChatMessage: function (roomId, subject, text) {
		check(this.userId, String);
		check(roomId, String);
		check(subject, String);
		check(text, String);

		var name = Meteor.user().profile.name || this.userId;

		Messages.insert({
			name: name,

			roomId: roomId,  // TODO check toId, add message type (to business, client-client, etc_
			fromId: this.userId,
			subject: subject,
			text: text,
			created: new Date
		});
	}
});

WlmSecurity.addPublish({
	chatMessages: { roles: 'all' }
});
WlmSecurity.addMethods({
	sendChatMessage: { roles: 'all' }
});