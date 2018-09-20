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
var debugStream = require('gulp-debug-streams');
var del = require('del');
var gulpif = require('gulp-if');
var mergeStream = require('merge-stream');
var polymerBuild = require('polymer-build');
var HtmlSplitter = require('polymer-build').HtmlSplitter;
var uglify = require('gulp-uglify-es').default;
var cssSlam = require('css-slam').gulp;
var htmlMinifier = require('gulp-html-minifier');
var copy = require('gulp-copy');
var { generateCountingSharedBundleUrlMapper,
       generateSharedDepsMergeStrategy } = require('polymer-bundler');
// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');
var sourcemaps = require('gulp-sourcemaps');

function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var polymerProject = new polymerBuild.PolymerProject(require('./polymer.json'));
var buildDirectory = 'build';

// promise that waits for stream to end
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

var poly = (doMinify) => {
    return () => {
        del.sync([buildDirectory]);
        const sourcesHtmlSplitter = new HtmlSplitter();

        var outStream = mergeStream(polymerProject.sources(), polymerProject.dependencies())
            .pipe(sourcemaps.init())
            .pipe(debug())
            .pipe(polymerProject.bundler({
                excludes: [ '@webcompontns/webcomponentsjs'],
                sourcemaps: true,
                stripComments: true,
                strategy: generateSharedDepsMergeStrategy(3),
                urlMapper: generateCountingSharedBundleUrlMapper('shared/bundle_')
            }));

        if (doMinify) {
            outStream = outStream
                .pipe(gulpif(/\.js$/, uglify({ compress: true })))
                .pipe(gulpif(/\.css$/, cssSlam()))
                .pipe(gulpif(/\.html$/, htmlMinifier()));
        }

        return outStream
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('build/'));
    };
}

gulp.task('polymer', poly(false));
gulp.task('polymer-prod', poly(true));

gulp.task('webcomponents', function () {
    return gulp.src([
        './node_modules/@webcomponents/webcomponentsjs/**'
    ])
        .pipe(copy('build/', { prefix: 2 }))
});

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('prod', ['css', 'polymer-prod', 'webcomponents'], function () {
    return Promise.resolve();
});

gulp.task('build', ['css', 'polymer', 'webcomponents'], function (/* cb */) {
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

gulp.task('zip', ['css', 'polymerBuild'], function () {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    return gulp.src([
        '**',
        '!./node_modules', '!./node_modules/**',
        '!./dist', '!./dist/**'
    ])
        .pipe(debug())
        .pipe(zip(filename))
        .pipe(gulp.dest(targetDir));
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});
