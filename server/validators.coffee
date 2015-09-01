Match.Id = Match.Where (id)->
  check id, String
  id.length > 12

Match.filledString = Match.Where (string)->
  check string, String
  string.length > 0

