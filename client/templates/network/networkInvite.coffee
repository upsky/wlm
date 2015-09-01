Schemas.inviteSchema = new SimpleSchema
  name:
    type: String
    label: i18n.get 'fields.name'
  email:
    type: String
    label: i18n.get 'fields.email'

Template.networkInvite.helpers
  networkInvite:
    blockId:"networkInvite"