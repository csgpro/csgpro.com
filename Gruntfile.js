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
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
              + '<%= grunt.template.today("yyyy-mm-dd") %> CSS bundle*/'
      }
    , combine: {
        files: {
          'public/css/bundle.css': [
            'public/css/normalize.css'
          , 'public/css/grid.css'
          , 'public/css/home.css'
          , 'public/css/swipeshow.css'
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
        }
      }
    }
  , uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - '
              + '<%= grunt.template.today("yyyy-mm-dd") %>'
              + '\r\n *  Third party libraries:'
              + '\r\n *  - Swipeshow: http://ricostacruz.com/swipeshow/'
              + '\r\n *'
              + '\r\n */'
      }
    , compress: {
        files: {
          'public/js/bundle.min.js': [
            'public/js/vendor/swipeshow.js'
          , 'public/js/bundle.js'
          ]
        }
      }
    }
  , watch: {
      all: {
        files: ['public/css/**/*.styl', 'public/js/**/*.js']
      , tasks: ['browserify', 'uglify', 'stylus','cssmin']
      , options: {
          spawn: false
        , livereload: true
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Run browserify then uglify to bundle all my Common JS modules and then the
  // non common JS ones, also minify them
  grunt.registerTask('default', ['browserify', 'uglify', 'stylus','cssmin']);

};