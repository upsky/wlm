@uinVN = (number) ->
  mult = [2, 4, 10, 4, 6, 8, 3, 5, 9]
  ch = number.toString().split("")
  while ch.length < 9
    ch.unshift 0
  sum = 0
  for j in [0..8]
    t = parseInt(ch[j])
    sum += t * mult[j]
  sum % 11 % 10

@uinGen = (number) ->
  parseInt(number.toString() + uinVN(number).toString())

@uinCheck = (str) ->
  parseInt(str.slice(-1)) is uinVN(parseInt(str.slice(0, -1)))

@isUin = (str) ->
  if parseInt(str).toString() is str
    uinCheck(str)
  else
    false

@fioSuggestion =
  serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs"
  token: Meteor.settings.public.dadata.token
  type: "NAME"
  useDadata: false
  triggerSelectOnSpace: false
  onSelect: (suggestion) ->
    Session.set("fioDadata", suggestion.data)

@addressSuggestion =
  serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs"
  token: Meteor.settings.public.dadata.token
  type: "ADDRESS"
  useDadata: false
  triggerSelectOnSpace: false
  onSelect: (suggestion) ->
    Session.set("addressDadata", suggestion.data)

@citySuggestion =
  serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs"
  token: Meteor.settings.public.dadata.token
  type: "ADDRESS"
  bounds: "city-settlement"
  useDadata: false
  triggerSelectOnSpace: false
  onSelect: (suggestion) ->
    Session.set("cityDadata", suggestion.data)

@emailSuggestion =
  serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs"
  token: Meteor.settings.public.dadata.token
  type: "EMAIL"
  suggest_local: false
  useDadata: false
  triggerSelectOnSpace: false
  onSelect: (suggestion) ->
    Session.set("emailData", suggestion.data)

@declOfNum = (number, titles) ->
  if number == Math.abs(parseInt(number))
    cases = [2, 0, 1, 1, 1, 2]
    titles[(if (number % 100 > 4 and number % 100 < 20) then 2 else cases[(if (number % 10 < 5) then number % 10 else 5)])]
  else
    titles[1]

@declOfSum = (sum) ->
  sum + ' ' + declOfNum(sum, [ "рубль", "рубля", "рублей" ])