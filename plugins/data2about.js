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
    var aboutPage = new File({
      cwd: file.cwd,
      base: file.base
    })
    aboutPage.path = path.join(path.dirname(file.path), 'index.html')
    aboutPage.contents = new Buffer(fn({
      tagsData: require('../site/data/indexes/tags.json'),
      dateData: require('../site/data/indexes/date.json'),
      active: 'about'
    }))
    
    cb(null, aboutPage)
  })
}
