Template.inviteItem.helpers
  statusText: ()->
    TAPi18n.__ 'db.inviteStatus.' + @status
  statusColor: ()->
    result = 'label-default'
    if @status == 'active'
      result = 'label-danger'
    if @status == 'used'
      result = 'label-success'
    result
  inviteUsed: ()->
    @status == 'used'