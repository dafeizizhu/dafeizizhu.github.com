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
var data2dates = require('./plugins/data2dates')

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
  gulp.src('layouts/home.jade')
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
        var years = []
        var months = {}
        files.forEach(function (file) {
          var data = require('./' + path.join('site', 'data', file))
          if (!dateMap[data.year]) {
            dateMap[data.year] = {}
            years.push(data.year)
          }
          if (!dateMap[data.year][data.month]) {
            dateMap[data.year][data.month] = []
            if (!months[data.year]) {
              months[data.year] = []
            }
            months[data.year].push(data.month)
          }
          var post = {
            link: '/' + path.relative(path.join(__dirname, 'site'), data.filePath),
            title: data.title,
            summary: data.summaryHtmlText,
            path: file,
            year: data.year,
            month: data.month,
            day: data.day,
            tags: data.tags
          }
          dateMap[data.year][data.month].unshift(post)
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

        for (var k in months) {
          months[k].sort().reverse()
        }

        fs.writeFileSync('./site/data/indexes/date.json', JSON.stringify({
          map: dateMap,
          years: years.sort().reverse(),
          months: months
        }))
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

gulp.task('build-indexes-dates', function (cb) {
  gulp.src('layouts/dates.jade')
    .pipe(data2dates())
    .pipe(prettify({
      indent_size: 2
    }))
    .pipe(gulp.dest('site/posts'))
    .on('end', cb)
})

gulp.task('build-common-css', function (cb) {
  gulp.src('common/**/*.min.css')
    .pipe(gulp.dest('site/common'))
    .on('end', cb)
})

gulp.task('build-css', function (cb) {
  gulp.src('css/**/*.css')
    .pipe(gulp.dest('site/css'))
    .on('end', cb)
})

gulp.task('build', function (cb) {
  runSequence('clean', 'build-favicon', 'build-common-css', 'build-css', 'build-posts', 'build-home', 'build-indexes-dates', cb)
})
