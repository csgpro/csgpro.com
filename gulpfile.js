var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy:false});
var path = require('path');
var rimraf = require('rimraf');
var through = require('through2');
var es = require('event-stream');
var nib = require('nib');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buildDir = "./public/";
var adminBuildDir = "./public/admin/";

function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new plugins.util.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
}

gulp.task('css', function(){
    gulp.src('./admin-app/app.less')
        .pipe(plugins.less())
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest(adminBuildDir + 'css/'));

	var filterStylus = plugins.filter('**/*.styl'),
		filterScss = plugins.filter('**/*.scss');

	gulp.src([
		'public/css/*.scss',
        'public/css/*.styl',
        '!public/css/bundle.css',
		'public/css/*.css'])
        .pipe(filterScss)
        .pipe(plugins.sass())
        .pipe(filterScss.restore())
		.pipe(filterStylus)
		.pipe(plugins.stylus({
	      use: nib(),
	      compress: true
	    }))
		.pipe(filterStylus.restore())
		.pipe(plugins.concat('bundle.css'))
		.pipe(gulp.dest(buildDir + 'css/'));
});

gulp.task('admin-vendorCSS', function(){
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
        '!./bower_components/bootstrap/**/*.css',
        './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest(adminBuildDir + 'css/'));
});

gulp.task('admin-vendorFonts', function(){
    gulp.src(['./bower_components/**/*.{ttf,woff,eof,svg}'])
    .pipe(plugins.flatten())
    .pipe(gulp.dest(adminBuildDir + 'fonts/'));
});

gulp.task('admin-copy-index', ['admin-clean'], function () {
    return gulp.src('./admin-app/index.html')
        .pipe(gulp.dest(adminBuildDir));
});

gulp.task('admin-scripts', ['admin-copy-index'], function () {

    libSrc = [
        './bower_components/ng-file-upload/angular-file-upload-html5-shim.js',
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        './bower_components/ng-grid/ng-grid-2.0.14.debug.js',
        './bower_components/satellizer/satellizer.js',
        './bower_components/ng-file-upload/angular-file-upload.js',
        './bower_components/angularjs-toaster/toaster.js',
        './bower_components/angular-busy/dist/angular-busy.js',
        './bower_components/marked/lib/marked.js',
        './bower_components/angular-marked/angular-marked.js'
    ];

    if (plugins.util.env.type === 'production') {
        var templateStream = gulp.src(['!./admin-app/index.html',
                './admin-app/**/*.html'])
                .pipe(plugins.angularTemplatecache('templates.js', { standalone: true }))
                .pipe(plugins.uglify())
                .pipe(plugins.rev())
                .pipe(gulp.dest(adminBuildDir + 'js/'));
    } else {
        var templateStream = gulp.src(['!./admin-app/index.html',
        './admin-app/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js', { standalone: true }))
        .pipe(gulp.dest(adminBuildDir + 'js/'));
    }

    var appStream = gulp.src([
        './admin-app/app.js',
        '!./admin-app/**/*test.js',
        './admin-app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.util.env.type === 'production' ? plugins.concat('app.js') : plugins.util.noop())
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.util.env.type === 'production' ? plugins.rev() : plugins.util.noop())
        .pipe(gulp.dest(adminBuildDir + 'js/'));

    var vendorStream = gulp.src(libSrc)
        .pipe(plugins.concat('lib.js'))
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.util.env.type === 'production' ? plugins.rev() : plugins.util.noop())
        .pipe(gulp.dest(adminBuildDir + 'js/'));

    return gulp.src(adminBuildDir + 'index.html')
        .pipe(plugins.inject(es.merge(vendorStream), { name: 'vendor', relative: true }))
        .pipe(plugins.inject(es.merge(templateStream), { name: 'templates', relative: true }))
        .pipe(plugins.inject(es.merge(appStream), { name: 'app', relative: true }))
        .pipe(gulp.dest(adminBuildDir));
});

gulp.task('scripts', function () {
	browserify('./public/js/main.js')
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(buildDir + 'js/'));

    gulp.src(['./public/js/vendor/simple-ajax-uploader.js','./public/js/admin-custom.js'])
        .pipe(plugins.concat('admin.js'))
        .pipe(gulp.dest(buildDir + 'js/'));
});

gulp.task('admin-clean', function () {
    gulp.src([adminBuildDir + 'index.html',
        adminBuildDir + 'js/*'], { read: false })
        .pipe(cleaner());
});

gulp.task('watch',function(){
    plugins.livereload.listen();
    gulp.watch([buildDir + '**/*.html', buildDir + '**/bundle.js', adminBuildDir + 'js/*.js', buildDir + '**/*.css'],
    function (event)
    {
        setTimeout(function() {
            plugins.livereload.changed(event);
        }, 1000);
    })
    gulp.watch(['./admin-app/**/*.js', '!./admin-app/**/*test.js', '!./admin-app/index.html', './admin-app/**/*.html'],['admin-scripts']);
    gulp.watch(['./admin-app/**/*.less', buildDir + '**/*.styl', '!' + buildDir + '**/bundle.css'],['css']);
    gulp.watch([buildDir + '**/*.js', '!' + buildDir + '**/bundle.js'],['scripts']);
});

gulp.task('connect', function() {
    plugins.nodemon({ script: 'app.js', ext: 'html js', ignore: ['./public/**'] })
    .on('change', [])
    .on('restart', function () {
      console.log('restarted!')
    })
});

// PUBLIC
gulp.task('default', ['shared-tasks', 'public-tasks', 'admin-tasks']);
gulp.task('serve', ['connect', 'default', 'watch']);

// ADMIN
gulp.task('admin-tasks', ['admin-scripts', 'admin-vendorCSS', 'admin-vendorFonts']);
gulp.task('admin', ['shared-tasks', 'admin-tasks']);

// PUBLIC
gulp.task('public-tasks', ['scripts']);
gulp.task('public', ['shared-tasks', 'public-tasks']);

// SHARED
gulp.task('shared-tasks', ['css']);
