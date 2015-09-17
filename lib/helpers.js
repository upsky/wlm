this.uinVN = function(number) {
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

this.uinGen = function(number) {
  return parseInt(number.toString() + uinVN(number).toString());
};

this.uinCheck = function(str) {
  return parseInt(str.slice(-1)) === uinVN(parseInt(str.slice(0, -1)));
};

this.isUin = function(str) {
  str = str.substr(1);
  if (parseInt(str).toString() === str) {
    return uinCheck(str);
  } else {
    return false;
  }
};

this.fioSuggestion = {
  serviceUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  token: Meteor.settings["public"].dadata.token,
  type: 'NAME',
  useDadata: false,
  triggerSelectOnSpace: false,
  onSelect: function(suggestion) {
    return Session.set('fioDadata', suggestion.data);
  }
};

this.addressSuggestion = {
  serviceUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  token: Meteor.settings["public"].dadata.token,
  type: 'ADDRESS',
  useDadata: false,
  triggerSelectOnSpace: false,
  onSelect: function(suggestion) {
    return Session.set('addressDadata', suggestion.data);
  }
};

this.citySuggestion = {
  serviceUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  token: Meteor.settings["public"].dadata.token,
  type: 'ADDRESS',
  bounds: 'city-settlement',
  useDadata: false,
  triggerSelectOnSpace: false,
  onSelect: function(suggestion) {
    return Session.set('cityDadata', suggestion.data);
  }
};

this.emailSuggestion = {
  serviceUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs',
  token: Meteor.settings["public"].dadata.token,
  type: 'EMAIL',
  suggest_local: false,
  useDadata: false,
  triggerSelectOnSpace: false,
  onSelect: function(suggestion) {
    return Session.set('emailData', suggestion.data);
  }
};

this.declOfNum = function(number, titles) {
  var cases;
  number = Math.abs(number);
  if (number === parseInt(number)) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20 ? 2 : cases[(number % 10 < 5 ? number % 10 : 5)])];
  } else {
    return titles[1];
  }
};

this.declOfSum = function(sum) {
  return sum + ' ' + declOfNum(sum, ['рубль', 'рубля', 'рублей']);
};
