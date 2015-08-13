var through = require('through2')
var jade = require('jade')
var path = require('path')

var fn = jade.compileFile(path.join(__dirname, '../layouts/post.jade'))

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file)
    }
    if (file.isStream()) {
      return cb(null, file)
    }

    var data = require(file.path)
    
    file.path = data.filePath
    file.contents = new Buffer(fn(data))

    cb(null, file)
  })
}
