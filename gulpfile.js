var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var replace = require('gulp-replace');
var fs = require('fs');
var rename = require("gulp-rename");

var imageResizeMin = function (src, dest, size) {
  return gulp.src(src)
    .pipe(imageResize({ 
      width : size,
      imageMagick : true,
    }))
    .pipe(imagemin({
			progressive: true,
		}))
    .pipe(rename(function (path) {
        path.basename += size;
    }))
    .pipe(gulp.dest(dest));
};

// Resize and Optimize Images
gulp.task('resize-min', function () {
  imageResizeMin('./views/images/pizzeria.jpg', './dist/views/images', 100);
  imageResizeMin('./views/images/pizzeria.jpg', './dist/views/images', 360);
});


var imageOptimizeTask = function (src, dest) {
  return gulp.src(src)
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 3,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dest));
};

// Optimize Images
gulp.task('image-min', () => {
    imageOptimizeTask(['./img/*.png','img/*.jpg'], './dist/img');
    imageOptimizeTask(['./views/images/*.png'], './dist/views/images');
});

// Lint JavaScript
// npm install jshint@2.x jshint-stylish gulp-jshint --save-dev
gulp.task('jshint', function() {
  return gulp.src(['./js/**/*.js', './views/js/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

// Minify JavaScript
// npm install gulp-uglify --save-dev
gulp.task('minify-js', function() {
  return gulp.src('./views/js/*.js')
    .pipe($.uglify({preserveComments: 'some'}))
    // Output Files
    .pipe(gulp.dest('./dist/views/js'));
});

// Copy files
gulp.task('copy-js', function() {
    return gulp.src(['./js/*.js'])
        .pipe(gulp.dest('./dist/js'));
});

// Minify css
// npm install --save-dev gulp-minify-css
gulp.task('minify-css', function() {
    gulp.src('./css/*.css')
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
    gulp.src('./views/css/*.css')
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/views/css'));;
});

// Minify HTML and replace above the fold css
// npm install --save-dev gulp-minify-html
// npm install --save-dev fs
// npm install --save-dev gulp-replace
gulp.task('minify-html', function() {
    var opts = {
        conditionals: true,
        spare:true
    };
    
    gulp.src('./*.html')
    .pipe($.minifyHtml(opts))
    .pipe(replace(/<link href=css\/style.css rel=stylesheet>/, function(s) {
      var style = fs.readFileSync('dist/css/style.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(replace(/<link href=\".*\" rel=stylesheet>/, function(s) {
      var style = fs.readFileSync('dist/css/google-fonts.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(replace(/pizzeria.jpg/, 'pizzeria100.jpg'))
    .pipe(gulp.dest('./dist'))
    
    gulp.src('./views/*.html')
    .pipe($.minifyHtml(opts))
    .pipe(replace(/pizzeria.jpg/, 'pizzeria360.jpg'))
    .pipe(gulp.dest('./dist/views'));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*'], {dot: true}));

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function(cb) {
  runSequence('minify-css', ['resize-min', 'image-min', 'minify-js', 'copy-js'],'minify-html', cb);
});

gulp.task('build', ['clean'], function(cb) {
  runSequence(['resize-min', 'image-min', 'minify-css', 'copy-js', 'minify-js'], cb);
});