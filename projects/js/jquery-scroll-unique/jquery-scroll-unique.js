$.fn.scrollUnique = function () {
  return $(this).each(function () {
    var eventType = 'mousewheel'
    if (document.mozHidden !== undefined) {
      eventType = 'DOMMouseScroll'
    }
    $(this).on(eventType, function (event) {
      var scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = this.clientHeight
      var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0)
      if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
        this.scrollTop = delta > 0 ? 0 : scrollHeight
        event.preventDefault()
      }
    })
  })
}
