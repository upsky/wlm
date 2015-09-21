var status;
var noticeError;
var connectionnStatus = true;
var lastConnectionnStatus = false;
var started = false;
Deps.autorun(function () {
  status = Meteor.status();

  if (started)
    if (status.connected) {
      connectionnStatus = true;

      if (!lastConnectionnStatus) {
        noticeError.remove();
        new PNotify({
          title: 'Соединение востановлено.',
          type: 'success'
        });
      }
    } else {
      connectionnStatus = false;

      if (lastConnectionnStatus) {
        noticeError = new PNotify({
          title: 'Соединение прервано.',
          type: 'error',
          hide: false
        });
      }

    }


  lastConnectionnStatus = connectionnStatus;
  started = true;
});

