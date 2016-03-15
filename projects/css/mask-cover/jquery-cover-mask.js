$.fn.coverMask = function (cover) {
  var targetWidth = $(this).width()
  var targetHeight = $(this).height()

  var pageWidth = $(document).width()
  var pageHeight = $(document).height()

  var offset = $(this).offset()
  var offsetTop = offset.top
  var offsetLeft = offset.left

  $(cover).css({
    width: targetWidth + 'px',
    height: targetHeight + 'px',
    borderWidth: offsetTop + 'px ' + 
      (pageWidth - targetWidth - offsetLeft) + 'px ' +
      (pageHeight - targetHeight - offsetTop) + 'px ' +
      offsetLeft + 'px',
    display: 'block'
  })
}
