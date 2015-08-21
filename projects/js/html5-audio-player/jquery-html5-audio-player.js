$.fn.html5AudioPlayer = function (url, options) {
  var _audio
  var _url = url
  var _options = options

  if (window['Audio'] && (_audio = new Audio()).canPlayType('audio/mpeg')) {
    var $container = $(this)
    var $title = $('<div />')
    var $time = $('<div />')
    var $range = $('<input />', {
      type: 'range',
      min: 0,
      max: 1,
      step: 'any',
      value: 0
    })
    var $play = $('<a>Play</a>')
    var $volume = $('<input />', {
      type: 'range',
      min: 0,
      max: 1,
      step: 'any',
      value: 0.5
    })

    $container.append('title:')
    $container.append($title)
    $container.append('time:')
    $container.append($time)
    $container.append($range)
    $container.append($play)
    $container.append('<br/>')
    $container.append('volume:')
    $container.append($volume)
    $container.append(_audio)

    _audio.addEventListener('canplay', onCanPlay)
    _audio.addEventListener('play', onPlay)
    _audio.addEventListener('pause', onPause)
    _audio.addEventListener('ended', onEnded)
    _audio.addEventListener('error', onError)
    _audio.addEventListener('timeupdate', onTimeUpdate)
    _audio.volume = 0.5

    $volume.on('change', onVolumeChange)
    $range.on('change', onRangeChange)
    $play.on('click', onPlayClick)

    $title.text(_url.replace(/^.*\//, ''))
    $range.prop('disabled', true)
    $range.val(0)
    $time.text('--:-- / --:--')
    $play.text('Loading...')
    _audio.src = _url

    if (options.autoPlay) {
      _audio.play()
    }
  } else {
    $container.append('Your browser does not support this plugin')
  }

  function onCanPlay() {
    $range.prop('disabled', false)
  }
  function onPlay() {
    $play.text('Pause')
  }
  function onPause() {
    $play.text('Resume')
  }
  function onEnded() {
    _audio.pause()
    _audio.currentTime = 0
  }
  function onError() {
    $range.prop('disabled', true)
    $title.text('Load Error')
    $play.text('Stopped')
  }
  function onTimeUpdate() {
    var pos = _audio.currentTime
    var duration = _audio.duration

    $time.text(pos + ' / ' + duration)
    $range.val(pos / duration)
  }
  function onVolumeChange() {
    _audio.volume = $volume.val()
  }
  function onRangeChange() {
    var duration = _audio.duration
    _audio.currentTime = duration * $range.val()
  }
  function onPlayClick() {
    if (_audio.paused) {
      _audio.play()
    } else {
      _audio.pause()
    }
  }
}
