module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  , browserify: {
    all: {
      src: ['public/js/main.js']
    , dest: 'public/js/bundle.js'
    }
  }
  , cssmin: {
      // options: {
      //   banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
      //         + '<%= grunt.template.today("yyyy-mm-dd") %> CSS bundle */\r\n'
      // }
      combine: {
        files: {
          'public/css/bundle.css': [
            'public/css/normalize.css'
          , 'public/css/grid.css'
          , 'public/css/home.css'
          , 'public/css/swipeshow.css'
          , 'public/css/typography.css'
          , 'public/css/lightbox.css'
          , 'public/css/github.css'
          ],
          'public/css/admin-app.css': [
            'public/css/admin/app.css',
            '!bower_components/**/*.min.css',
            '!bower_components/bootstrap/**/*',
            'bower_components/**/*.css'
          ]
        }
    }
    , minify: {
        src: ['public/css/bundle.css']
      , dest: 'public/css/bundle.min.css'
    }
    , minify_admin: {
        src: ['public/css/admin-app.css']
      , dest: 'public/css/admin-app.min.css'
    }
  }
  , stylus: {
      compile: {
        options: {
          use: [require('nib')]
        }
      , files: {
          'public/css/home.css': 'public/css/home.styl'
        , 'public/css/admin.css': 'public/css/admin.styl'
        , 'public/css/typography.css': 'public/css/typography.styl'
        }
      }
    }
  , uglify: {
      compress: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
                + '<%= grunt.template.today("yyyy-mm-dd") %>'
                + '\r\n *  Third party libraries:'
                + '\r\n *  - Swipeshow: http://ricostacruz.com/swipeshow/'
                + '\r\n *  - Magnific: http://dimsemenov.com/plugins/magnific-popup/'
                + '\r\n *  - Simplemodal: http://www.ericmmartin.com/projects/simplemodal/'
                + '\r\n *'
                + '\r\n */'
        }
      , files: {
          'public/js/bundle.min.js': [
            'public/js/vendor/swipeshow.js'
          , 'public/js/vendor/magnific.js'
          , 'public/js/vendor/jquery.simplemodal.1.4.4.min.js'
          , 'public/js/bundle.js'
          ]
        }
    }
    }
  , ngtemplates: {
    app: {
        cwd: 'public/js/admin/app',
        src: '**/*.html',
        dest: 'public/js/admin-templates.js'
    }
  }
  , concat: {
      concatAdminLibs: {
          src: ['bower_components/ng-file-upload/angular-file-upload-shim.js',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/angular/angular.js',
                'bower_components/angular-route/angular-route.js',
                'bower_components/angular-animate/angular-animate.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                'bower_components/ng-grid/build/ng-grid.js',
                'bower_components/satellizer/satellizer.js',
                'bower_components/ng-file-upload/angular-file-upload.js',
                'bower_components/angularjs-toaster/toaster.js',
                'bower_components/angular-busy/angular-busy.js'],
          dest: 'public/js/admin-libs.js'
      }
      , concatAdminApp: {
          src: ['public/js/admin/app/app.js',
                'public/js/admin/app/**/*.js'],
          dest: 'public/js/admin-app.js'
      }
  }
  , watch: {
      all: {
        files: ['public/css/**/*.css', 'public/css/*.styl', 'public/js/**/*', 'views/*.jade']
      , tasks: ['browserify', 'uglify', 'stylus','cssmin', 'ngtemplates', 'concat']
      , options: {
          spawn: false
        , livereload: true
        }
      }
    }
  , server: {
      port: 3000,
      base: './public'
    }
  , express: {
      options: {

      },
      dev: {
          options: {
              script: 'app.js'
          }
      }
    }
  });


  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('serve', ['default', 'express:dev', 'watch']);

  grunt.registerTask('server', 'Start a custom web server', function ()
  {
    var port = 3000;
    grunt.log.writeln('Started web server on port ' + port);
    require('./app.js').listen(port);
  });

  // Run browserify then uglify to bundle all my Common JS modules and then the
  // non common JS ones, also minify them
  grunt.registerTask('default', ['browserify', 'uglify', 'concat', 'ngtemplates', 'stylus','cssmin']);

};
