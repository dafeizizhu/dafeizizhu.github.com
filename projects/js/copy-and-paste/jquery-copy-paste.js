$(function () {
  if (typeof URL != 'function' ||
    typeof Blob != 'function') {
    alert('这个浏览器貌似不能运行这个Demo')
  }

  document.addEventListener('paste', function (evt) {
    var clipboard = evt.clipboardData

    if (!clipboard || !clipboard.items || !clipboard.items.length) {
      return
    }

    var temp
    if ((temp = clipboard.items[0]) && temp.kind == 'file' && temp.type.indexOf('image') >= 0) {
      $('#image').prop('src', URL.createObjectURL(temp.getAsFile()))
    } else if (temp = clipboard.getData('text/plain')) {
      $('#text').val(temp)
    }
    
    evt.preventDefault()
  })
})
