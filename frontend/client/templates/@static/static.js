var fadeIn;

fadeIn = function () {
	return setTimeout(function () {
		$('.sidebar, .wrapper').addClass('animated fadeInUp');
		return setTimeout(function () {
			return $('.sidebar, .wrapper').removeClass('animated fadeInUp').css('opacity', '1');
		}, 1050);
	}, 50);
};

Template.blocked.rendered = function () {
	return fadeIn();
};
Template.forbidden.rendered = function () {
	return fadeIn();
};

Template.down.rendered = function () {
	return fadeIn();
};

Template.error.rendered = function () {
	return fadeIn();
};
