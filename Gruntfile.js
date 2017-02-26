module.exports = function (grunt) {

    var themepathWeb  = 'public/',
        themePath     =  themepathWeb,
        srcPath       = themepathWeb + 'src/',
        devScripts    = themePath + 'js/scripts.dev.js',
        devScriptsSrc = themePath + 'src/',
        prodScripts   = themePath + 'js/scripts.min.js',
        devStyles     = themePath + 'css/style.dev.css',
        devStylesSrc  = themePath + 'src/',
        prodStyles    = themePath + 'css/style.min.css';

    var jsIeFiles = '';
    var jsVendorFiles = [
        srcPath + 'libs/bootstrap/js/affix.js' ,
        srcPath + 'libs/bootstrap/js/alert.js',
        srcPath + 'libs/bootstrap/js/button.js',
        srcPath + 'libs/bootstrap/js/carousel.js',
        srcPath + 'libs/bootstrap/js/collapse.js',
        srcPath + 'libs/bootstrap/js/dropdown.js',
        srcPath + 'libs/bootstrap/js/modal.js',
        srcPath + 'libs/bootstrap/js/scrollspy.js',
        srcPath + 'libs/bootstrap/js/tab.js',
        srcPath + 'libs/bootstrap/js/tooltip.js',
        srcPath + 'libs/bootstrap/js/popover.js',
        srcPath + 'libs/bootstrap/js/transition.js'
    ];

    var jsFiles = [
        srcPath + 'js/general.js',
        srcPath + 'js/modals.js'
    ];

    var configBridge = grunt.file.readJSON('public/src/grunt/configBridge.json', { encoding: 'utf8' });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * Copyright 2011 Twitter, Inc.\n' +
        ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' +
        ' */\n',
        jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
        jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

        concat: {
            options: {
                banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
                stripBanners: false
            },
            bootstrap: {
                src: jsVendorFiles,
                dest:  themePath + 'js/bootstrap_custom.js'
            },
            theme: {
                options: {
                    separator: ';'
                },
                dist: {
                    src: [jsFiles],
                    dest:  'js/<%= pkg.name %>.js'
                }
            }
        },

        less: {
            options: {
                outputSourceFiles: true, // with this param you'll have your less in your map
                report: 'min',
                ieCompat: true,
                sourceMap: true,
                sourceMapRootpath: '',
                sourceMapBasepath: '',
                compress: true,
                cleancss: true,
                relativeUrls: false
            },
            development: {
                files: [
                    {
                        dest:  devStyles,
                        src: devStylesSrc + "less/style.less"
                    }
                ],
                options: {
                    compress: false,
                    cleancss: false,
                    sourceMapFilename: themePath + 'css/style.dev.css.map',
                    sourceMapURL:  'style.dev.css.map'
                }
            },
            production: {
                files: [
                    {
                        dest: prodStyles,
                        src: srcPath + "less/style.less"
                    }
                ],
                options: {
                    sourceMap: false
                }
            }
        },

        uglify: {
            options: {
                mangle: true,
                compress: {
                    drop_console: true
                },
                beautify: false,
                report: "min",
                enclose: undefined,

                wrap: undefined,
                exportAll: false,
                preserveComments: false,
                banner: '', //'/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
                footer: ''
            },
            development: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: {
                        drop_console: false
                    },
                    sourceMap: true,
                    sourceMapIncludeSources: false,
                    sourceMapName: themePath + 'js/scripts.dev.js.map',
                    preserveComments: 'all'
                },
                files: [
                    {
                        src: [devScriptsSrc + 'js/*.js'],
                        dest: devScripts
                    }
                ]
            },
            production: {
                files: [
                    {
                        src: [jsFiles],
                        dest: prodScripts
                    }
                ]
            }
            /*,

             internetexplorer: {
             options: {
             mangle: true,
             beautify: false,
             preserveComments: true,
             compress: {
             drop_console: true
             }
             },
             files: [
             {
             src: [jsIeFiles],
             dest: themePath + 'js/script.ie.js'
             }
             ]
             }*/
        },
        jshint: {
            /*files: ['Gruntfile.js', srcPath + 'js/** /*.js'], double ** for recursive dir*/
            files: ['Gruntfile.js', devScriptsSrc + '*.js'],
            options: {
                reporterOutput: '',
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            less: {
                files: [srcPath + 'less/**/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: true,
                    livereload: true
                }
            },
            js: {
                files: [jsFiles],
                tasks: ['jshint', 'uglify', 'concat'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        },

        symlink: {
            options: {
                overwrite: true
            },
            devStylesSrc: {
                expand: true,
                cwd: srcPath,
                src: ['less', 'libs'],
                dest: devStylesSrc
            },
            devScriptsSrc: {
                expand: true,
                cwd: srcPath,
                src: ['js'],
                dest: devScriptsSrc
            },
            fontsFontAwesome: {
                expand: true,
                cwd: srcPath + 'libs/font-awesome',
                src: ['fonts/*'],
                dest: themePath
            },
            fontsBootstrap: {
                expand: true,
                cwd: srcPath + 'libs/bootstrap',
                src: ['fonts/*'],
                dest: themePath
            },
            fontsCustomer: {
                expand: true,
                cwd: srcPath + 'less/custom',
                src: ['fonts/*'],
                dest: themePath
            },
        },

        clean: {
            fonts:  [themePath + 'fonts'],
            source: [devStylesSrc, devScriptsSrc],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['clean', 'symlink', 'jshint', 'less', 'concat', 'uglify']);

};