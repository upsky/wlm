uinVN = function (number) {
	var ch, i, j, mult, sum, t;
	mult = [2, 4, 10, 4, 6, 8, 3, 5, 9];
	ch = number.toString().split('');
	while (ch.length < 9) {
		ch.unshift(0);
	}
	sum = 0;
	for (j = i = 0; i <= 8; j = ++i) {
		t = parseInt(ch[j]);
		sum += t * mult[j];
	}
	return sum % 11 % 10;
};

uinGen = function (number) {
	return parseInt(number.toString() + uinVN(number).toString());
};

uinCheck = function (str) {
	return parseInt(str.slice(-1)) === uinVN(parseInt(str.slice(0, -1)));
};

isUin = function (str) {
	str = str.substr(1);
	if (parseInt(str).toString() === str) {
		return uinCheck(str);
	} else {
		return false;
	}
};

var dadataUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';
var dadataCommon = {
	serviceUrl: dadataUrl,
	token: Meteor.pubSettings('dadata', 'token'),
	useDadata: false,
	triggerSelectOnSpace: false
};

var dadataSettings = function (options) {
	return _.extend({}, dadataCommon, options);
};

fioSuggestion = dadataSettings({
	type: 'NAME',
	onSelect: function (suggestion) {
		return Session.set('fioDadata', suggestion.data);
	}
});

addressSuggestion = dadataSettings({
	type: 'ADDRESS',
	onSelect: function (suggestion) {
		return Session.set('addressDadata', suggestion.data);
	}
});

citySuggestion = {
	type: 'ADDRESS',
	bounds: 'city-settlement',
	onSelect: function (suggestion) {
		return Session.set('cityDadata', suggestion.data);
	}
};

emailSuggestion = {
	type: 'EMAIL',
	suggest_local: false,
	onSelect: function (suggestion) {
		return Session.set('emailData', suggestion.data);
	}
};

declOfNum = function (number, titles) {
	var cases;
	number = Math.abs(number);
	if (number === parseInt(number)) {
		cases = [2, 0, 1, 1, 1, 2];
		return titles[(number % 100 > 4 && number % 100 < 20 ? 2 : cases[(number % 10 < 5 ? number % 10 : 5)])];
	} else {
		return titles[1];
	}
};

declOfSum = function (sum) {
	return sum + ' ' + declOfNum(sum, ['рубль', 'рубля', 'рублей']);
};
