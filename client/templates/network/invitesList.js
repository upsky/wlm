Template.invitesList.helpers({
	invitesList: {
		blockId: "invitesList"
	},
	settings: {
		rowsPerPage: 30,
		showFilter: false,
		showNavigation: 'auto',
		fields: [
			{ key: 'name', label: 'Имя' },
			{ key: 'email', label: 'Эл. почта' },
			{
				key: 'status', label: 'Статус',
				tmpl: Template.inviteListStatus
			},
			{
				key: 'created', label: 'Создан',
				fn: function (value, object) {
					return moment(value).fromNow();
				}
			},
			{
				key: '_id', label: 'Ссылка для регистрации',
				tmpl: Template.inviteListCopyLink
			}
		]
	},
	invites: db.invites.find({
		status: {
			$ne: 'qr'
		}
	})
});
