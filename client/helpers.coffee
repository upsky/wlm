UI.registerHelper "videoInstruction", (tag, hash, decor, lang) ->
  decor ?= "pull-right hidden-sm hidden-xs active"
  lang ?= "ru_RU"
  video = db.videos.findOne
    tag: tag
    type: "instruction"
  if video
    """
      <a data-toggle="modal" data-video="//www.youtube.com/embed/#{ video.ytId }" href="#" title="#{ video.tag }" data-tag="#{ video.tag }" class="#{ decor }"><i class="fa fa-youtube-play"></i> <small>Видеоинструкция</small></a>
    """
  else
    """
      <a href="#" title="#{ tag }" class="pull-right hidden-sm hidden-xs"><i class="fa fa-youtube-play"></i></a>
    """

UI.registerHelper "pageTitle", ()->
  path = Session.get 'currentPath'
  log.info path
  pageTitle = TAPi18n.__ 'pageTitles.' + path
  document.title = pageTitle + " / " + TAPi18n.__ 'pageTitles.topTitle'
  pageTitle
