var through = require('through2')
var path = require('path')
var moment = require('moment')

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    var argv = require('yargs').argv

    if (!argv.title) {
      throw new Error('title is required')
    }

    file.path = path.join(path.dirname(file.path), moment().format('YYYY-MM-DD') + '-' + argv.title + '.md')

    cb(null, file)
  })
}
