module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [ 'js/admin.uw-slideshow.dev.js' ],
        dest: 'js/admin.uw-slideshow.js'
      }
    },
    uglify: {
      options: {
        // banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n'
      },
      dist: {
        files: {
          'js/admin.uw-slideshow.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: [ 'gruntfile.js', '<%= concat.dist.src %>' ],
      options: {
        asi: true,
        smarttabs: true,
        laxcomma: true,
        lastsemic: true,
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    notify: {
      watch: {
        options: {
          title: 'Dun\' Grunted',
          message: 'All is good'
        }
      }
    },
    less: {
        production: {
	        options: {
		        cleancss: true
			},
			files: {
				'css/admin.uw-slideshow.css': 'less/admin.uw-slideshow.less'
			}
		},
		development: {
			files: {
				'css/admin.uw-slideshow.dev.css': 'less/admin.uw-slideshow.less'
			}
		}
	},
    watch: {
      config : {
        files : ['gruntfile.js'],
        options : {
          reload: true
        }
      },
      js: {
        files: ['<%= concat.dist.src %>'],
        tasks: ['js']
      },
      css: {
        files: ['less/*.less'],
        tasks: ['css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'notify', 'less']);
  grunt.registerTask('js', ['jshint', 'concat', 'uglify', 'notify' ]);
  grunt.registerTask( 'css', ['less', 'notify'] );

};
