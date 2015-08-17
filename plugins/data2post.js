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
    var posts = require(path.join(__dirname, '../site/data/indexes/posts.json'))
    
    var index
    for (var i = 0; i < posts.length; i++) {
      if (file.path.indexOf(posts[i].path) >= 0) {
        index = i
      }
    }

    if (!isNaN(index)) {
      if (index > 0) {
        data.nextPage = {
          link: posts[index - 1].link,
          title: posts[index - 1].title
        }
      }
      if (index < posts.length - 1) {
        data.prevPage = {
          link: posts[index + 1].link,
          title: posts[index + 1].title
        }
      }
    }

    data.tagsData = require('../site/data/indexes/tags.json')
    
    file.path = data.filePath
    file.contents = new Buffer(fn(data))

    cb(null, file)
  })
}
