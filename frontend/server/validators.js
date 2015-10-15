Match.Id = Match.Where(function(id) {
  check(id, String);
  return id.length > 12;
});

Match.filledString = Match.Where(function(string) {
  check(string, String);
  return string.length > 0;
});
