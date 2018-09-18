var gulp = require('gulp');
var path = require('path');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var vulcanize = require('gulp-vulcanize');
var debug = require('gulp-debug');
var copy = require('gulp-copy');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('build', ['css', 'vulcanize', 'webcomponentsjs'], function (/* cb */) {
    return nodemonServerInit();
});

gulp.task('vulcanize', function () {
    return gulp.src('./imports.html')
        .pipe(debug({title: 'unicorn:'}))
        .pipe(vulcanize({
            sourcemaps: true,
            abspath: __dirname,
            inputUrl: '/imports.html'
        }))
        .pipe(gulp.dest('assets/components'));
});

gulp.task('webcomponentsjs', function () {
    return gulp.src(['./node_modules/@webcomponents/**'])
        .pipe(copy('assets/built', { prefix: 2 }));
})

gulp.task('css', function () {
    var processors = [
        easyimport,
        customProperties,
        colorFunction(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];

    return gulp.src('assets/css/*.css')
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/built/'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch('assets/css/**', ['css']);
});

gulp.task('zip', ['css'], function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        '**',
        'node_modules/@webcomponents/webcomponentsjs',
        '!node_modules', '!node_modules/**',
        '!dist', '!dist/**'
    ])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
