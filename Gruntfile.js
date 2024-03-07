module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        mangle: true,
        compress: true,
				sourceMap: true,
				sourceMapName: 'build/cheatgui.min.js.map'
      },
      build: {
        files: {
          'build/cheatgui.min.js': ['src/js/**/*.js']
        }
      }
    },

    cssmin: {
      build: {
        files: {
          'build/cheatgui.min.css': ['src/css/**/*.css']
        }
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      build: {
        files: {
          'build/cheatgui.min.js': ['src/js/**/*.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/js/**/*.js', 'src/css/**/*.css'],
        tasks: ['babel', 'uglify', 'cssmin'],
        options: {
          spawn: false
        }
      }
    },

		usebanner: {
      options: {
        position: 'top',
        banner: '/* CheatGUI | (C) Cat-125 | https://github.com/cat-125/cheatgui/ */\n',
        linebreak: true
      },
      files: {
        src: ['build/*.min.js', 'build/*.min.css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-banner');

  grunt.registerTask('default', ['babel', 'uglify', 'cssmin', 'usebanner']);
};