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

      var fileContents = String(file.contents).replace(/###/g, '### ').replace('{% include JB/setup %}', '')
      var layout = /layout: (.*)/.exec(fileContents)[1]
      var title = /title: \"([^\"]*)"/.exec(fileContents)[1]
      var description = /description: \"([^\"]*)"/.exec(fileContents)[1]
      var tags = /tags: \[([^\]]*)\]/.exec(fileContents)[1].split(', ')
      var filePath = path.join(path.dirname(file.path), '../site/posts', year, month, day, fileName + '.html')
      var markdownText = fileContents.substring(fileContents.lastIndexOf('---') + 3)
      var summaryMarkdownText = markdownText.split('\n').slice(0, 25).join('\n')

      marked(markdownText, function (err, markdownResult) {
        var htmlText = markdownResult.toString()
        marked(summaryMarkdownText, function (err, summaryMarkdownResult) {
          var summaryHtmlText = summaryMarkdownResult.toString()
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
            htmlText: htmlText,
            summaryMarkdownText: summaryMarkdownText,
            summaryHtmlText: summaryHtmlText
          }))
          cb(null, file)
        })
      })
    }
  })
}
