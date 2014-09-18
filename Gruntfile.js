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
          ]
        }
    }
    , minify: {
        src: ['public/css/bundle.css']
      , dest: 'public/css/bundle.min.css'
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
    , compressAdmin: {
        files: {
          'public/js/admin.js': [
            'public/js/vendor/simple-ajax-uploader.js',
            'public/js/admin-custom.js'
          ]
        }
      }
    }
  , watch: {
      all: {
        files: ['public/css/*.css', 'public/css/*.styl', 'public/js/**/*.js', 'views/*.jade']
      , tasks: ['browserify', 'uglify', 'stylus','cssmin']
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

  grunt.registerTask('serve', ['default', 'express:dev', 'watch']);

  grunt.registerTask('server', 'Start a custom web server', function ()
  {
    var port = 3000;
    grunt.log.writeln('Started web server on port ' + port);
    require('./app.js').listen(port);
  });

  // Run browserify then uglify to bundle all my Common JS modules and then the
  // non common JS ones, also minify them
  grunt.registerTask('default', ['browserify', 'uglify', 'stylus','cssmin']);

};
