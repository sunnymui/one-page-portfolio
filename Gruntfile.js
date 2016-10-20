module.exports = function(grunt) {

  /*
  ===========
  PLUGINS
  ===========
  1. imagemin - compress images
  2. responsive images - create multiple size images for responsive use
  3. responsive images extender - scan html files for img tags and add srcset if the responsive images are there
  4. postcss: autoprefixer - postcss allows processing of css, autoprefixer is a plugin for it that adds prefixes for legacy browser support
  . watch - watch and run grunt when changes made
  . newer - lets designated plugins only run on updated files
  . uglify - minify and concat js

  ============
  TASK TARGETS
  ============
  dev: (default)
  runs tasks that matter just for dev environment

  */

  var mozjpeg = require('imagemin-mozjpeg'); //plugin for imagemin

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.

    // imagemin plugin - optimize image compression
    imagemin: {
        dynamic: { // target
            options: {
                optimizationLevel: 7, // max optimize pngs
                progressive: true, // progressive jpgs
                interlaced: true, // progressive gifs
                use: [mozjpeg({quality:80})] // use the mozjpeg optimizer plugin for imagemin because it's better for web
            },
            files: [{
                expand: true, // Enable dynamic expansion
                cwd: 'img/', // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'], // Actual patterns to match, case SENSITIVE
                dest: 'img/' // Destination path prefix
            }]
        },
        // for optimizing just favicons
        icons: {
          options: {
              optimizationLevel: 7, // max optimize pngs
          },
          files: [{
              expand: true, // Enable dynamic expansion
              cwd: 'img/Favicons/images/', // Src matches are relative to this path
              src: ['**/*.png'], // Actual patterns to match, case SENSITIVE
              dest: 'img/Favicons/images/' // Destination path prefix
          }]
        }
    },

    // responsive images plugin - generate multiple sizes of images
    responsive_images: {
      dev: {
        //options {

        //},
        files: [{
            expand: true,
            src: ['**/*.{jpg,gif,png}'], // double asterisk matches subdirectories in addition to current
            cwd: 'src/img',
            dest: 'img/'
        }]
      }
    },

    // responsive image extender - scans html file for img tags and automatically adds srcset
    responsive_images_extender: {
      ignoring: {
        options: {
          ignore: ['.headshot'] // ignore images with these css identifiers
        },
        files: [{
          expand: true,
          src: ['**/*.{html,htm,php}'],
          cwd: 'src/',
          dest: 'build/'
        }]
      }
    },

    // postcss - podyprocess your css using the autoprefixer plugin
    postcss: {
      options: {
        map: true,
        processors: [
          // load autoprefixer plugin
          require('autoprefixer')({
            browsers: ['last 2 versions','ie 9-10'] // prefix to the last 2 versions of browsers
          })
        ]
      },
      dist: {
        src: 'src/css/style.css', // only prefix my stylesheet
        dest: 'build/css/style.css'
      }
    },

    // concatenation plugin - combines files into one
    /*concat: {
      options: {
      },
      dist: {
        src: '',
        dest: ''
      }
    }, */
    // uglify plugin - minifies files
    /*uglify: {
      options: {
      },
      dist: {
        src: '',
        dest: ''
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    }*/
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-responsive-images-extender');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  // Default task.
  grunt.registerTask('default', [
    'responsive_images',
    'imagemin',
    'postcss',
  ]);

  // Build task for production eg minified and prefixed everything
  // grunt.registerTask('build', ['imagemin']);

};
