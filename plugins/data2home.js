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

    var posts = require('../site/data/indexes/posts.json')

    var pageSize = 10
    var pages = Math.ceil(posts.length / pageSize)
    
    for (var i = 0; i < pages; i++) {
      var postSlice = posts.slice(i * pageSize, (i + 1) * pageSize)
      var data = new File({
        cwd: file.cwd,
        base: file.base,
      })
      data.path = path.join(path.dirname(file.path), i == 0 ? './index.html' : './index/' + i + '.html')
      data.contents = new Buffer(fn({
        pageSize: pageSize,
        page: i,
        pages: pages,
        posts: postSlice,
        tagsData: require('../site/data/indexes/tags.json'),
        dateData: require('../site/data/indexes/date.json')
      }))
      this.push(data)
    }
    cb()
  })
}
