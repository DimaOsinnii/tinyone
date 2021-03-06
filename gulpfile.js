const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const del = require('del');
const concat = require('gulp-concat');
const pipeline = require('readable-stream').pipeline;
const babel = require('gulp-babel');

function styles() {
    return pipeline(
        gulp.src(['./app/styles/normalize.css','./app/styles/dropdown.css','./app/styles/less/main.less']),
        sourcemaps.init(),
        less(),
        concat('main.css'),
        autoprefixer('last 10 versions', 'ie 9'),
        cleanCSS(),
        sourcemaps.write('./'),
        gulp.dest('./build/css'),
        browserSync.stream()
    )
}

function scripts() {
    return pipeline(
        gulp.src(['./app/scripts/*.js']),
        sourcemaps.init(),
        babel({
            presets: [
                ['@babel/env', {
                modules: false
            }]
            ]
        }),
        uglify(),
        concat('main.js'),
        sourcemaps.write("./"),
        gulp.dest('./build/js'),
        browserSync.stream()
    )
}

function clean() {
    return del(['build/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./app/styles/less/**/*.less', styles);
    gulp.watch('./app/**/*.js', scripts);
    gulp.watch("/*.html").on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
gulp.task('dev', gulp.series('build', watch));