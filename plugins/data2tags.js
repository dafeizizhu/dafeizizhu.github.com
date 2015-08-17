var through  = require('through2')
var jade = require('jade')
var path = require('path')
var File = require('vinyl')

module.exports = function (optons) {
  return through.obj(function (file, enc,  cb) {
    if (!file.isBuffer()) {
      return cb(null, file)
    }

    var fn = jade.compileFile(file.path)
    var tags = require('../site/data/indexes/tags.json').tags
    var tagsMap = require('../site/data/indexes/tags.json').tagsMap

    // Build page for all tags
    var tagsPage = new File({
      cwd: file.cwd,
      base: file.base
    })
    tagsPage.path = path.join(path.dirname(file.path), 'index.html')
    tagsPage.contents = new Buffer(fn({
      tags: tags,
      tagsMap: tagsMap
    }))

    this.push(tagsPage)

    // Build page for single tag
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      var tagPage = new File({
        cwd: file.cwd,
        base: file.base
      })
      tagPage.path = path.join(path.dirname(file.path), tag, 'index.html')
      tagPage.contents = new Buffer(fn({
        tags: [tag],
        tagsMap: tagsMap
      }))

      this.push(tagPage)
    }

    cb()
  })
}
