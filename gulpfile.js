var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var debug = require('gulp-debug');
var del = require('del');
var gulpif = require('gulp-if');
var mergeStream = require('merge-stream');
var rename = require('gulp-rename');
var polymerBuild = require('polymer-build');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

var polymerJson = require('./polymer.json');
var polymerProject = new polymerBuild.PolymerProject(polymerJson);
var buildDirectory = './components/build';
var forkStream = require('polymer-build').forkStream;
var run = require('gulp-run');
var template = require('gulp-template');

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('polymerBuild', function () {
    return run("cd components; polymer build").exec();
});

gulp.task('prod', ['css', 'polymerBuild', 'genDefault'], function () {
    return Promise.resolve();
});

gulp.task('build', ['css', 'polymerBuild', 'genDefault'], function (/* cb */) {
    return nodemonServerInit();
});

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

gulp.task('genDefault', function () {
    return gulp.src('./default.hbs.template')
        .pipe(template({ header: fs.readFileSync('./build/es6/components/index.html')}))
        .pipe(rename("default.hbs"))
        .pipe(gulp.dest('.'));
});

gulp.task('zip', ['css', 'polymerBuild', 'genDefault'], function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        '**',
        '!node_modules', '!node_modules/**',
        '!dist', '!dist/**'
    ])
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
