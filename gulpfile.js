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
		'public/css/*.styl',
		'public/css/*.scss',
        '!public/css/bundle.css',
		'public/css/*.css'])
		.pipe(filterStylus)
		.pipe(plugins.stylus({
	      use: nib(),
	      compress: true
	    }))
		.pipe(filterStylus.restore())
		.pipe(filterScss)
		.pipe(plugins.sass())
		.pipe(filterScss.restore())
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

gulp.task('admin-copy-index', function () {
    return gulp.src('./admin-app/index.html')
        .pipe(gulp.dest(adminBuildDir));
});

gulp.task('admin-scripts', ['admin-clean', 'admin-copy-index'], function () {

    libSrc = [
        './bower_components/ng-file-upload/angular-file-upload-shim.js',
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        './bower_components/ng-grid/build/ng-grid.js',
        './bower_components/satellizer/satellizer.js',
        './bower_components/ng-file-upload/angular-file-upload.js',
        './bower_components/angularjs-toaster/toaster.js',
        './bower_components/angular-busy/dist/angular-busy.js'
    ];

    var templateStream = gulp.src(['!./admin-app/index.html',
            './admin-app/**/*.html'])
            .pipe(plugins.angularTemplatecache('templates.js', { standalone: true }))
            .pipe(gulp.dest(adminBuildDir + 'js/'));

    var appStream = gulp.src([
        './admin-app/app.js',
        '!./admin-app/**/*test.js',
        './admin-app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(gulp.dest(adminBuildDir + 'js/'));

    var vendorStream = gulp.src(libSrc)
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest(adminBuildDir + 'js/'));

    return gulp.src(adminBuildDir + 'index.html')
        .pipe(plugins.inject(es.merge(vendorStream), { name: 'vendor', relative: true }))
        .pipe(plugins.inject(es.merge(templateStream), { name: 'templates', relative: true }))
        .pipe(plugins.inject(es.merge(appStream), { name: 'app', relative: true }))
        .pipe(gulp.dest(adminBuildDir));
});

gulp.task('scripts', function () {
	return browserify('./public/js/main.js')
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(buildDir + 'js/'));
});

gulp.task('admin-clean', function () {
    gulp.src([adminBuildDir + 'index.html',
        adminBuildDir + 'js/*'], { read: false })
        .pipe(cleaner());
});

gulp.task('watch',function(){
    var initializing = true;
    if(!initializing) {
        gulp.watch([
            adminBuildDir + '*.html',
            adminBuildDir + 'js/*.js',
            adminBuildDir + 'css/*.css',
            buildDir + '*.html',
            buildDir + 'js/*.js',
            buildDir + 'css/*.css'

        ], function(event) {
            return gulp.src(event.path)
                .pipe(plugins.express.notify());
        });
    } else {
        initializing = false;
    }
    gulp.watch(['./admin-app/**/*.js','!./admin-app/**/*test.js'],['admin-scripts']);
    gulp.watch(['!./admin-app/index.html','./admin-app/**/*.html'],['admin-scripts']);
    gulp.watch('./admin-app/**/*.less', buildDir + '**/*.styl', '!' + buildDir + '**/bundle.css',['css']);
    gulp.watch([buildDir + '**/*.js', '!' + buildDir + '**/bundle.js'],['scripts']);
});

gulp.task('connect', plugins.express.run({
    env: "development",
    file: "app.js"
}));

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
