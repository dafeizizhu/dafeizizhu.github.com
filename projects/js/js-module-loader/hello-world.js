define(function () {
  return {
    getH1: function (name) {
      var h1 = document.createElement('h1')
      h1.innerHTML = 'Hello world, ' + name
      return h1
    }
  }
})
