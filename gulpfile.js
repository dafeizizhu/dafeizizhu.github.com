var gulp = require('gulp')
var jade = require('gulp-jade')
var data = require('gulp-data')
var runSequence = require('run-sequence')
var rimraf = require('rimraf')
var prettify = require('gulp-prettify')
var fs = require('fs')
var path = require('path')

var markdown2data = require('./plugins/markdown2data')
var data2post = require('./plugins/data2post')
var data2home = require('./plugins/data2home')

gulp.task('default', function () {
  console.log('test')
})

gulp.task('clean', function (cb) {
  rimraf('./site', cb)
})

gulp.task('build-favicon', function (cb) {
  gulp.src('favicon.ico')
    .pipe(gulp.dest('site'))
    .on('end', cb)
})

gulp.task('build-home', function (cb) {
  gulp.src('home.jade')
    .pipe(data2home())
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest('site'))
    .on('end', cb)
})

gulp.task('build-data', function (cb) {
  gulp.src('_posts/*.md')
    .pipe(markdown2data())
    .pipe(gulp.dest('site/data'))
    .on('end', function () {
      fs.readdir('site/data', function (err, files) {
        var dateMap = {}
        var postList = []
        files.forEach(function (file) {
          var data = require('./' + path.join('site', 'data', file))
          if (!dateMap[data.year]) {
            dateMap[data.year] = {}
          }
          if (!dateMap[data.year][data.month]) {
            dateMap[data.year][data.month] = []
          }
          var post = {
            link: '/' + path.relative(path.join(__dirname, 'site'), data.filePath),
            title: data.title,
            summary: data.summaryHtmlText
          }
          dateMap[data.year][data.month].push(post)
          postList.unshift(post)
        })
        if (!fs.existsSync('./site')) {
          fs.mkdirSync('./site')
        }
        if (!fs.existsSync('./site/data')) {
          fs.mkdirSync('./site/data')
        }
        if (!fs.existsSync('./site/data/indexes')) {
          fs.mkdirSync('./site/data/indexes')
        }
        fs.writeFileSync('./site/data/indexes/date.json', JSON.stringify(dateMap))
        fs.writeFileSync('./site/data/indexes/posts.json', JSON.stringify(postList))
        cb()
      })
    })
})

gulp.task('build-posts', ['build-data'],  function (cb) {
  gulp.src('site/data/*.json')
    .pipe(data2post())
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest('site/posts'))
    .on('end', cb)
})

gulp.task('build', function (cb) {
  runSequence('clean', 'build-favicon', 'build-home', cb)
})
