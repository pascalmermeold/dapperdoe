'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-serve');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('dapperdoe.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    coffee: {
      compile: {
        files: {
          'src/dapperdoe.js': ['app/js/main.coffee', 'app/js/template.coffee', 'app/js/snippet.coffee', 'app/js/content.coffee', 'app/js/app.coffee'] // compile and concat into single file
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/dapperdoe.js', 'libs/rangy/*.js'],
        dest: 'src/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    less: {
      options: {
        banner: '<%= banner %>'
      },
      development: {
        files: {
          "src/dapperdoe.css": "app/css/dapperdoe.less"
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/dapperdoe.min.css': ['src/dapperdoe.css']
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/js/*.coffee'],
        tasks: ['coffee', 'concat', 'uglify']
      },
      watch: {
        files: ['app/css/dapperdoe.less'],
        tasks: ['less', 'cssmin']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['coffee', 'concat', 'uglify', 'less', 'cssmin', 'watch']);

};
