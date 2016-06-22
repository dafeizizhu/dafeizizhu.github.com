define(['./hello-world'], function (helloWorld) {
  return {
    init: function () {
      document.body.appendChild(helloWorld.getH1('MZY'))
    }
  }
})
