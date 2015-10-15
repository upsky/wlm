if (Meteor.isServer) {
	Meteor.methods({
		getChartData: function (doc) {
			check(doc, Schemas.statisticFilter);
			return db.users.aggregate([
				//возвращаем массив в том виде данных, в каком его обрабатывает график.В name хранится наименование страны, в Y-количество.
				{
					$group: {
						_id: "$geo." + doc.showCharts,
						name: { $first: { $ifNull: ["$geo." + doc.showCharts, "Не указано"] } },
						y: { $sum: 1 }
					}
				}
			]);
		}
	})
}
