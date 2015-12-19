var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sprity = require('sprity');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var strip = require('gulp-strip-comments');
var angularTemplateCache = require('gulp-angular-templatecache')
var ngmin = require('gulp-ngmin');
var runSequence = require('gulp-run-sequence');
var preprocess = require('gulp-preprocess');
var minifyHtml = require('gulp-minify-html');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['build']);
 
gulp.task('build-dev', function(cb) {
  runSequence('dev', cb);
});
 
gulp.task('build-prod', function(cb) {
  runSequence('minifyDevJs', 'minifyLibJs', 'minifyAllJs', 'prod', 'templates', cb);
});

gulp.task('build', function(cb) {
  runSequence('minifyDevJs', 'minifyLibJs', 'minifyAllJs', 'templates', cb);
});

gulp.task('templates', function() {
  return gulp.src(['./www/template/**/*.html'])
    .pipe(minifyHtml({empty: true}))
    .pipe(angularTemplateCache({
      'root':'template',
      'module':'templates',
      'standalone':'true'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./www/dist/js/'))
});

gulp.task('sprites', function () {
  return sprity.src({
    src: './www/image/**/*.{png,jpg}',
    split: true,
    name: 'icons',
    style: './sprite.css',
    prefix: 'img',
    // ... other optional options 
    // for example if you want to generate scss instead of css 
    // processor: 'sass', // make sure you have installed sprity-sass 
  })
  .pipe(gulpif('*.png', gulp.dest('./www/dist/image/'), gulp.dest('./www/dist/css/')))
});

gulp.task('minifyCss', function(done) {
  gulp.src('./www/css/*.css')
    .pipe(minifyCss({keepBreaks: false}))
    .pipe(concat('all.css'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./www/dist/css/'))
    .on('end', done);
});

gulp.task('minifyDevJs', function(done) {
  gulp.src(['./www/js/**/*.js'])
    .pipe(concat('dev.js'))
    .pipe(ngmin())
    .pipe(uglify({mangle: false}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./www/dist/js/'))
    .on('end', done);
});

gulp.task('minifyLibJs', function(done) {
  gulp.src([
      './www/lib/ionic/js/ionic.bundle.min.js',
      './www/lib/js/jquery-1.10.2.min.js', 
      './www/lib/ionic/js/ngCordova/dist/ng-cordova.min.js',
      './www/lib/js/ng-file-upload-master/dist/ng-file-upload-shim.min.js',
      './www/lib/js/ng-file-upload-master/dist/ng-file-upload.min.js'
    ])
    .pipe(ngmin())
    .pipe(concat('lib.js'))
    .pipe(uglify({mangle: false}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./www/dist/js/'))
    .on('end', done);
});

gulp.task('minifyAllJs', function(done) {
  gulp.src(['./www/dist/js/templates.js', './www/dist/js/dev.min.js', './www/dist/js/lib.min.js'])
    .pipe(concat('all.js'))
    .pipe(ngmin())
    .pipe(uglify({mangle: false}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./www/dist/js/'))
    .on('end', done);
});

gulp.task('minifyAllJs', function(done) {
  gulp.src(['./www/dist/js/templates.js', './www/dist/js/dev.min.js', './www/dist/js/lib.min.js'])
    .pipe(concat('all.js'))
    .pipe(ngmin())
    .pipe(uglify({mangle: false}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./www/dist/js/'))
    .on('end', done);
});

gulp.task('dev', function() {
  gulp.src('./build/index_tpl.html')
    .pipe(preprocess({context: { NODE_ENV: 'dev'}}))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./www'));
});

gulp.task('prod', function() {
  gulp.src('./build/index_tpl.html')
    .pipe(preprocess({context: { NODE_ENV: 'prod'}}))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('./www'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
