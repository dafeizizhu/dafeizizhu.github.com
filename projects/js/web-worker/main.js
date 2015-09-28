$(function () {
  function log(message) {
    $('#logs').prepend('<p>' + message + '</p>')
  }

  if (typeof Worker != 'function') {
    log('您的浏览器不支持Web Worker')
    return
  }

  var $echoButton = $('#postMessageForEcho')
  var $errorButton = $('#postMessageForError')
  var $inlineButton = $('#postMessageForInline')

  var echoWorker, errorWorker, inlineWorker

  $echoButton.on('click', function (evt) {
    echoWorker = new Worker('echo-worker.js')
    echoWorker.addEventListener('message', function (evt) {
      log(evt.data.toString())
    })
  })

  $errorButton.on('click', function (evt) {
    errorWorker = new Worker('error-worker.js')
    errorWorker.addEventListener('error', function (evt) {
      log('error, line ' + evt.lineno + ' in ' + evt.filename + ': ' + evt.message)
    })
  })

  if (typeof URL != 'function' || 
      typeof URL.createObjectURL != 'function' ||
      typeof Blob != 'function') {
    log('您的浏览器不支持内联Web Worker')
    return
  }

  $inlineButton.on('click', function (Evt) {
    var code = 'postMessage("I am inline!")'
    inlineWorker = new Worker(URL.createObjectURL(new Blob([code], {
      type: 'text/javascript'
    })))
    inlineWorker.addEventListener('message', function (evt) {
      log('From inline Web worker: ' + evt.data.toString())
    })
  })
})
