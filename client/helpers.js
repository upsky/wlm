UI.registerHelper('videoInstruction', function(tag, hash, decor, lang) {
  var video;
  if (decor == null) {
    decor = 'pull-right hidden-sm hidden-xs active';
  }
  if (lang == null) {
    lang = 'ru_RU';
  }
  video = db.videos.findOne({
    tag: tag,
    type: 'instruction'
  });
  if (video) {
    return "<a data-toggle=\"modal\" data-video=\"//www.youtube.com/embed/" + video.ytId + "\" href=\"#\" title=\"" + video.tag + "\" data-tag=\"" + video.tag + "\" class=\"" + decor + "\"><i class=\"fa fa-youtube-play\"></i> <small>Видеоинструкция</small></a>";
  } else {
    return "<a href=\"#\" title=\"" + tag + "\" class=\"pull-right hidden-sm hidden-xs\"><i class=\"fa fa-youtube-play\"></i></a>";
  }
});

UI.registerHelper('pageTitle', function() {
  var pageTitle, path;
  path = Session.get('currentPath');
  pageTitle = TAPi18n.__('pageTitles.' + path);
  document.title = pageTitle + ' / ' + TAPi18n.__('pageTitles.topTitle');
  return pageTitle;
});

UI.registerHelper('Session', function (varName) {
  return Session.get(varName);
});