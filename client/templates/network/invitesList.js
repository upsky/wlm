Template.invitesList.helpers({
	invitesList: {
		blockId: "invitesList"
	},
	filterLabel: function () {
		return TAPi18n.__('search');
	},
	settings: {
		rowsPerPage: 30,
		showFilter: false,
		showNavigation: 'auto',
		filters: [ 'nameFilter' ],
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
					if (!value)
						return TAPi18n.__('messages.unknown');

					return moment(value).fromNow();
				}
			},
			{
				key: '_id', label: 'Ссылка для регистрации',
				sortable: false,
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
