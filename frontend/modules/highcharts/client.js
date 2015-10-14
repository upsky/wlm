if (Meteor.isClient) {

	Meteor.call('getCountryChartData', function (error, res) {
		Session.set('chartData', res);
	});

	Template.highcharts.topGenresChart = function () {
		return {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: 'Статистика пользователей по странам'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y} ',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				name: "Всего",
				colorByPoint: true,
				data: Session.get('chartData')
			}]
		};
	}


}