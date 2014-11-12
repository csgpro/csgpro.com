var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy:false});
var path = require('path');
var rimraf = require('rimraf');
var through = require('through2');
var es = require('event-stream');
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
		'public/css/normalize.css',
		'public/css/swipeshow.css',
		'public/css/lightbox.css',
		'public/css/github.css',
		'public/css/MyFontsWebfontsKit.css'])
		.pipe(filterStylus)
		.pipe(plugins.stylus())
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

gulp.task('admin-scripts', function () {

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
	gulp.src(['public/js/vendor/swipeshow.js',
		'public/js/vendor/magnific.js',
		'public/js/vendor/jquery.simplemodal.1.4.4.min.js',
		'public/js/main.js'])
		.pipe(plugins.concat('bundle.js'))
		.pipe(gulp.dest(buildDir + 'js/'));
});

gulp.task('admin-clean', function () {
    gulp.src([adminBuildDir + 'index.html',
        adminBuildDir + 'js/*'], { read: false })
        .pipe(cleaner());
});

gulp.task('admin-watch',function(){
    gulp.watch([
        adminBuildDir + '*.html',
        adminBuildDir + 'js/*.js',
        adminBuildDir + 'css/*.css'

    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.express.notify());
    });
    gulp.watch(['./admin-app/**/*.js','!./admin-app/**/*test.js'],['scripts']);
    gulp.watch(['!./admin-app/index.html','./admin-app/**/*.html'],['scripts']);
    gulp.watch('./admin-app/**/*.less',['css']);

});

gulp.task('watch', function() {
	gulp.watch([
		buildDir + '*.html',
		buildDir + 'js/*.js',
		buildDir + 'css/*.css'

	], function(event) {
		return gulp.src(event.path)
			.pipe(plugins.express.notify());
	});
	gulp.watch([buildDir + '**/*.js', '!' + buildDir + '**/bundle.js'],['scripts']);
	gulp.watch([buildDir + '**/*.styl','!' + buildDir + '**/bundle.css'],['css']);
});

gulp.task('connect', plugins.express.run({
    env: "development",
    file: "app.js",
    port: 3000
}));

// PUBLIC
gulp.task('default', ['css', 'scripts',])
gulp.task('serve', ['connect','default','watch']);

// ADMIN
gulp.task('admin-tasks', ['css', 'admin-clean', 'admin-copy-index', 'admin-scripts', 'vendorCSS', 'admin-vendorFonts'])
gulp.task('serve-admin', ['connect', 'admin-tasks', 'admin-watch']);
