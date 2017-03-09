var gulp        = require('gulp'),
    pug         = require('gulp-pug'),
    stylus      = require('gulp-stylus'),
    jeet        = require('jeet'),
    nib         = require('nib'),
    rupture     = require('rupture'),
    browserSync = require('browser-sync').create(),
    imagemin    = require('gulp-imagemin'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    ignore      = require('gulp-ignore'),
    plumber     = require('gulp-plumber'),
    del         = require('del');




// HTML
// Compile Pug HTML

gulp.task('pug:watch', function() {
  var LOCALS = {};

  return gulp.src(['views/**/*.pug', '!views/_layout/**/*', '!views/_partials/**/*'])
    .pipe(plumber())
    .pipe(pug({
      locals: LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});


gulp.task('pug:build', function() {
  var LOCALS = {};

  return gulp.src(['views/**/*.pug', '!views/_layout/**/*', '!views/_partials/**/*'])
    .pipe(pug({
      locals: LOCALS,
      pretty: false
    }))
    .pipe(gulp.dest('build/'));
});




// CSS
// Compile Stylus CSS

gulp.task('stylus:watch', function () {
  return gulp.src('assets/styles/master.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: false,
      use: [jeet(), nib(), rupture()]
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('stylus:build', function () {
  return gulp.src('assets/styles/master.styl')
    .pipe(stylus({
      compress: true,
      use: [jeet(), nib(), rupture()]
    }))
    .pipe(gulp.dest('build/css'));
});



// JavaScript
// Concat, rename and uglify all JS

var jsFiles = [
  'assets/js/jquery.js',
  'assets/js/master.js'
];

gulp.task('js:watch', function() {
  return gulp.src(jsFiles)
    .pipe(plumber())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('js:build', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});



// Imagemin
// Optimize all images

gulp.task('imagemin', function() {
  return gulp.src('assets/images/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
    .pipe(browserSync.stream());
});



// Copy fonts

gulp.task('copy-fonts', function() {
  return gulp.src('assets/fonts/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('build/fonts/'))
});



// Browser Sync
// Reload on file changes in /build

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build/",
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
});




// Watch
// Watch HTML and CSS compilation changes

gulp.task('watch-tasks', function() {
  gulp.watch('views/**/*.pug', ['pug:watch']);
  gulp.watch('assets/styles/**/*.styl', ['stylus:watch']);
  gulp.watch('assets/js/**/*.js', ['js:watch']);
  gulp.watch('assets/images/**/*', ['imagemin']);
});



// Clean 
// Clean 'build' folder

gulp.task('clean-build', function() {
  console.log('Cleaning build folder');
  return del('build/');
});



// Run Tasks

gulp.task('watch', ['pug:watch', 'stylus:watch', 'js:watch', 'imagemin', 'copy-fonts', 'browser-sync', 'watch-tasks']);
gulp.task('build', ['pug:build', 'stylus:build', 'js:build', 'imagemin', 'copy-fonts']);
gulp.task('clean', ['clean-build']);
