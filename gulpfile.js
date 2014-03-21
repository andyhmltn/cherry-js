var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify')

gulp.task('scripts', function() {
  gulp.src('./cherry/*.js')
    .pipe(concat('cherry.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
});