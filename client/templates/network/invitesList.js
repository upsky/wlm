Template.invitesList.helpers({
	invitesList: {
		blockId: "invitesList",
		hideBox: true
	},
	settings: function () {
		return {
			rowsPerPage: 30,
			showFilter: false,
			showNavigation: 'auto',
			fields: [
				{ key: 'name', label: TAPi18n.__('formFields.name.label') },
				{ key: 'email', label: TAPi18n.__('formFields.email.label') },
				{
					key: 'status', label: TAPi18n.__('formFields.status.label'),
					tmpl: Template.inviteListStatus
				},
				{
					key: 'created', label: TAPi18n.__('formFields.created.label'),
					fn: function (value) {
						if (value instanceof Date) {
							return moment(value).fromNow();
						} else {
							return TAPi18n.__('messages.incorrectDate')
						}
					}
				},
				{
					key: '_id', label: TAPi18n.__('formFields.regLink.label'),
					tmpl: Template.inviteListCopyLink
				}
			]
		}
	},
	invites: db.invites.find({
		status: {
			$ne: 'qr'
		}
	})
});
