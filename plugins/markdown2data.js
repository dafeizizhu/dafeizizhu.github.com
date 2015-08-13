var through = require('through2')
var marked = require('marked')
var path = require('path')

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return cb(null, file)
    }

    if (file.isBuffer()) {
      var date = /([\d]{4})\-([\d]{2})\-([\d]{2})/.exec(file.path)
      var year = date[1]
      var month = date[2]
      var day = date[3]

      var fileName = /[\d]{4}\-[\d]{2}\-[\d]{2}\-([^\.]*).md/.exec(file.path)[1]

      var fileContents = String(file.contents)
      var layout = /layout: (.*)/.exec(fileContents)[1]
      var title = /title: \"([^\"]*)"/.exec(fileContents)[1]
      var description = /description: \"([^\"]*)"/.exec(fileContents)[1]
      var tags = /tags: \[([^\]]*)\]/.exec(fileContents)[1].split(', ')
      var filePath = path.join(path.dirname(file.path), '../site/posts', year, month, day, fileName + '.html')
      var markdownText = fileContents.substring(fileContents.indexOf('%}') + 2)

      marked(markdownText, function (err, result) {
        file.path = path.join(path.dirname(file.path), path.basename(file.path, '.md')) + '.json'
        file.contents = new Buffer(JSON.stringify({
          year: year,
          month: month,
          day: day,
          filePath: filePath,
          fileName: fileName,
          layout: layout,
          title: title,
          description: description,
          tags: tags,
          markdownText: markdownText,
          htmlText: result.toString()
        }))

        cb(null, file)
      })
    }
  })
}
