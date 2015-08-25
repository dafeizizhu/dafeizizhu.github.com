$.pageVisibility = function () {
  return 'hidden' in document ? !document.hidden : (function () {
    var r = null

    $.each(['webkit', 'moz', 'ms', 'o'], function (i, prefix) {
      if ((prefix + 'Hidden') in document) {
        return r = !(document[prefix + 'Hidden'])
      }
    })

    return r
  })()
}
