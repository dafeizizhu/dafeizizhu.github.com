var through = require('through2')
var jade = require('jade')
var path = require('path')
var File = require('vinyl')

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (!file.isBuffer()) {
      return cb(null, file)
    }

    var fn = jade.compileFile(file.path)
    var date = require('../site/data/indexes/date.json')

    // Build years indexes page
    var yearsPage = new File({
      cwd: file.cwd,
      base: file.base
    })
    yearsPage.path = path.join(path.dirname(file.path), 'index.html')
    yearsPage.contents = new Buffer(fn({
      date: date
    }))

    this.push(yearsPage)

    // Build each year indexes page
    for (var i = 0; i < date.years.length; i++) {
      var year  = date.years[i]
      var yearPage = new File({
        cwd: file.cwd,
        base: file.base
      })
      yearPage.path = path.join(path.dirname(file.path), year, 'index.html')
      yearPage.contents = new Buffer(fn({
        date: {
          years: [year],
          months: date.months,
          map: date.map
        }
      }))

      this.push(yearPage)

      // Build each month indexes page
      for (var j = 0; j < date.months[year].length; j++) {
        var month = date.months[year][j]
        var monthPage = new File({
          cwd: file.cwd,
          base: file.base
        })
        monthPage.path = path.join(path.dirname(file.path), year, month, 'index.html')
        var months = {}
        months[year] = []
        months[year].push(month)
        monthPage.contents = new Buffer(fn({
          date: {
            years: [year],
            months: months,
            map: date.map
          }
        }))

        this.push(monthPage)
      }       
    }

    cb()
  })
}
