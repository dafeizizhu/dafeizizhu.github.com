var through = require('through2')
var jade = require('jade')
var path = require('path')
var File = require('vinyl')
var glob = require('glob')

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (!file.isBuffer()) {
      return cb(null, file)
    }

    var fn = jade.compileFile(file.path)

    glob('site/projects/data/**/*.json', {}, function (err, files) {
      var map = {}
      files.forEach(function (file) {
        var data = require('../' + file)

        if (!map[data.tag]) {
          map[data.tag] = []
        }
        map[data.tag].push(data)
      })

      file.path = path.join(path.dirname(file.path), 'index.html')
      file.contents = new Buffer(fn({
        projectsMap: map,
        tagsData: require('../site/data/indexes/tags.json'),
        dateData: require('../site/data/indexes/date.json'),
        active: 'projects'
      }))

      cb(null, file)
    })
  })
}
