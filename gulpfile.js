/**
 * process automation
 */
var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concatCss = require('gulp-concat-css'),
    run = require('gulp-run');

//create variables that Gulp can refer to
var src = './process',
    app = './app';

//look for render.js, send it through Browserify, process the react code and covert it to JavaScript.
//call css files
gulp.task('js', function() {
  return gulp.src( src + '/js/render.js' )
    .pipe(browserify({
      transform: 'reactify',
      extensions: 'browserify-css',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    //send results to
    .pipe(gulp.dest(app + '/js'));
});

gulp.task('html', function() {
  gulp.src( src + '/**/*.html');
});

//look for files in our css folder and concatenate it into app/css folder
gulp.task('css', function() {
  gulp.src( src + '/css/*.css')
  .pipe(concatCss('app.css'))
  .pipe(gulp.dest(app + '/css'));
});

//fonts from bootstrap, move it to fonts folder
gulp.task('fonts', function() {
    gulp.src('node_modules/bootstrap/dist/fonts/**/*')
    .pipe(gulp.dest(app + '/fonts'));
});

//watch for changes
gulp.task('watch', ['serve'], function() {
  gulp.watch( src + '/js/**/*', ['js']);
  gulp.watch( src + '/css/**/*.css', ['css']);
  gulp.watch([ app + '/**/*.html'], ['html']);
});

//run app
gulp.task('serve', ['html', 'js', 'css'], function() {
  run('electron app/main.js').exec();
});

gulp.task('default', ['watch', 'fonts', 'serve']);
