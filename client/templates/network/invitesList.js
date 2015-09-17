Template.invitesList.helpers({
  invitesList: {
    blockId: "invitesList"
  },
  invites: db.invites.find({
    status: {
      $ne: 'qr'
    }
  })
});
