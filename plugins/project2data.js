var through = require('through2')
var path = require('path')

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (!file.isBuffer()) {
      return cb(null, file)
    }

    var title = /<title>([^<]*)/.exec(String(file.contents))[1]
    var link = '/' + path.relative('.', file.path)
    var tag = /projects\/([^\/]*)/.exec(link)[1]

    file.path = path.join(path.dirname(file.path), path.dirname('.html')) + '.json'
    file.contents = new Buffer(JSON.stringify({
      title: title,
      link: link,
      tag: tag
    }))

    cb(null, file)
  })
}
