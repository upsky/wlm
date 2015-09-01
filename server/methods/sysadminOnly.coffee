Meteor.methods
  impersonate: (userId) ->
    check userId, Match.Id
    unless Meteor.users.findOne userId
      throw new Meteor.Error(404, 'User not found');
    else
      this.setUserId userId
