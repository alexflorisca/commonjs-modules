module.exports = function(grunt) {

    grunt.initConfig({

        // Browserify
        browserify: {
            dev: {
                options: {
                    // Add source maps
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: ['main.js', 'modules/*.js'],
                dest: 'build.js'
            },

            prod: {
                options: {
                    browserifyOptions: {
                        debug: false,
                    }
                },
                src: '<%= browserify.dev.src %>',
                dest: '<%= browserify.dev.dest %>'
            }
        },

        watch: {
            files: ['main.js', 'gruntfile.js', 'modules/*.js', 'tests/*.js'],
            tasks: ['browserify:dev']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify:dev', 'watch']);

};