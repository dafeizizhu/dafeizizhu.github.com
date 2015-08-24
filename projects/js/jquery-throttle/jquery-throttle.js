$.throttle = function (fn, delay, mustRunDelay) {
  delay = delay || 50
  mustRunDelay = mustRunDelay || 100

  var timer = null
  var t_start

  return function () {
    var context = this
    var args = arguments
    var t_current = new Date().valueOf()

    clearTimeout(timer)
    if (!t_start) {
      t_start = t_current
    }
    if (t_current - t_start >= mustRunDelay) {
      fn.apply(context, args)
      t_start = t_current
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
}
