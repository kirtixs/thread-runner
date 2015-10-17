var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    options = {
        tests: 'test/**/*Test.js',
        src: 'src/**/*.js',
        init: function () {
            this.javascripts = [this.tests, this.src];
            return this;
            delete this.init;
        }
    }.init();


gulp.task('lint', function () {
    return gulp.src(options.javascripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    return gulp.src(options.tests, {read: false})
        .pipe(mocha())
});

gulp.watch([options.javascripts], ['lint', 'test']);

gulp.task('default', ['lint', 'test']);