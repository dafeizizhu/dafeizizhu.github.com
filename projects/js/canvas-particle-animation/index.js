(function () {
  var canvas = document.getElementById('myCanvas')
  if (!canvas.getContext) return

  var dWidth = 300
  var dHeight = 300
  var ctx = canvas.getContext('2d')
  var image = new Image()
  var imageData
  var particles = []
  image.onload = function () {
    getImageData()
    calculate()
   
    document.getElementById('random').onclick = animate(drawRandom)
    document.getElementById('easeInOut').onclick = animate(drawEaseInOut)
  }
  image.src = './logo.png'

  function animate(draw) {
    return function () {
      var allSteps = 100
      var steps = allSteps
      requestAnimationFrame(function step() {
        draw(steps, allSteps)

        if (steps-- > 0) {
          requestAnimationFrame(step)
        }
      })
    }
  }

  function easeInOutExpo(t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b
    t--
    return c / 2 * (-Math.pow(2, -10 * t) + 2) + b
  }

  window.easeInOutExpo = easeInOutExpo

  function getImageData() {
    var c = document.createElement('canvas')
    c.width = dWidth 
    c.height = dHeight
    c.getContext('2d').drawImage(image, 0, 0, dWidth, dWidth)
    imageData = c.getContext('2d').getImageData(0, 0, dWidth, dHeight)
  }

  function calculate() {
    var len = imageData.data.length
    var cols = 100,
        rows = 100
    
    var s_width = parseInt(imageData.width / cols)
    var s_height = parseInt(imageData.height / rows)

    var pos = 0
    var par_x, par_y

    for (var i = 1; i <= cols; i++) {
      for (var j = 1; j <= rows; j++) {
        pos = ((j - 1) * s_height * imageData.width + (i - 1) * s_width) * 4
        if (imageData.data[pos] > 200) {
          particles.push({
            x: (canvas.width - dWidth) / 2 + (i - 1) * s_width,
            y: (canvas.height - dHeight) / 2 + (j - 1) * s_height,
            fillStyle: '#ff0000'
          })
        }
      }
    }
  }

  function drawRandom(step, steps) {
    var radius = step * 10
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0, len = particles.length; i < len; i++) {
      var curr_particle = particles[i]
      ctx.fillStyle = curr_particle.fillStyle
      var offsetX = (Math.random() - .5) * radius
      var offsetY = (Math.random() - .5) * radius
      ctx.fillRect(curr_particle.x + offsetX, curr_particle.y + offsetY, 1, 1)
    }
  }

  function drawEaseInOut(step, steps) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0, len = particles.length; i < len; i++) {
      var curr_particle = particles[i]
      ctx.fillStyle = curr_particle.fillStyle
      if (step == 0) {
        ctx.fillRect(curr_particle.x, curr_particle.y, 1, 1)
      } else {
        var xDistance = curr_particle.x - canvas.width / 2
        var x = easeInOutExpo(steps - step, xDistance * ((steps - step) / steps), xDistance / steps, 1) + canvas.width / 2
        var y = easeInOutExpo(steps - step, curr_particle.y * ((steps - step) / steps), curr_particle.y / steps, 1)
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
})()
