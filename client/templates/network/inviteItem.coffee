Template.inviteItem.helpers
  statusText: ()->
    i18n.get 'db.inviteStatus.' + @status
