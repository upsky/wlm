if (Meteor.isClient) {
	Template.statisticFilters.helpers({
		statisticFilters: {
			blockId: "statisticFilters"
		}
	});
	AutoForm.hooks({
		statisticFilter: {
			onSuccess: function (type, result) {
				console.log(result);
				Session.set('chartData', result);

			}
		}
	});
}