if (Meteor.isServer) {
	Meteor.methods({
		getCountryChartData: function () {
			return db.users.aggregate([
				//возвращаем массив в том виде данных, в каком его обрабатывает график.В name хранится наименование страны, в Y-количество.
				{
					$group: {
						_id: "$geo.country",
						name: { $first: { $ifNull: ["$geo.country", "Не указано"] } },
						y: { $sum: 1 }
					}
				}
			]);
		}
	});
}
