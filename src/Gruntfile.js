"use strict";

module.exports = function(grunt) {

    // Module Requires
    // --------------------------
    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);


    // Init Config
    // --------------------------

    var appConfig = {

        // Dirs
        dirs: {
            // PATHS SRC
            base: "../deploy",
            js: "assets/js",
            sass: "assets/sass",

            // ASSETS DEPLOY
            css: "../deploy/css",
            jsfinal: "../deploy/js",
            img: "../deploy/img",
        },

        // Metadata
        pkg: grunt.file.readJSON("package.json"),
        banner:
        "\n" +
        "/*\n" +
        " * -------------------------------------------------------\n" +
        " * Project: <%= pkg.title %>\n" +
        " * Version: <%= pkg.version %>\n" +
        " * Author:  <%= pkg.author.name %> (<%= pkg.author.email %>)\n" +
        " *\n" +
        " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.title %>\n" +
        " * -------------------------------------------------------\n" +
        " */\n" +
        "\n",

        // Start Server
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '<%= dirs.base %>',
                    hostname: 'localhost',
                    livereload: true,
                    open: true
                }
            }
        },

        // Watch Task
        watch: {
            options: {
                livereload: true,
                spawn: false
            },
            css: {
                files: "<%= dirs.sass %>/**",
                tasks: ["compass","autoprefixer"],
                options: {
                    spawn: false
                }
            },
            js: {
                files: "<%= jshint.all %>",
                tasks: ["jshint", "uglify"]
            },

            files: ["<%= dirs.base %>/*.html"]
        },

        // Linting
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                "Gruntfile.js",
                "<%= dirs.js %>/main.js"
            ]
        },

        // Minifica e concatena
        uglify: {
            options: {
                mangle: false,
                banner: "<%= banner %>"
            },
            dist: {
                files: {
                    // Seu script do projeto
                    "<%= dirs.jsfinal %>/site.min.js": ["<%= dirs.js %>/main.js","<%= dirs.js %>/legacy/*"],
                    "<%= dirs.jsfinal %>/bootstrap.min.js": ["<%= dirs.js %>/bootstrap/**/*.js"]
                    // CSS para concatenar                   
                }
            }
        },

        // Compile Sass/Scss to CSS
        compass: {
            dist: {
                options: {
                    force: true,
                    config: "config.rb",
                }
            }
        },


        // Prefixo automático para css cross browser
        autoprefixer: {
            options: {
                browsers: ['last 5 version']
            },

            single_file: {
                src: '<%= dirs.css %>style.css',
                dest: '<%= dirs.css %>style.css'
            }

        },


        // Otimiza as imagens utilizando o Imagemagick
        shell: {
            imagemagick: {
                command: 'mogrify -strip -interlace Plane -quality 70 <%= dirs.img %>/*.{jpg,png,gif}'
            }
        },

        // FTP Deploy
        ftpush: {
            build: {
                auth: {
                    host: "host",
                    port: 21,
                    authKey: "key1"
                },
                src: "../deploy/",
                dest: "/public_html/paginas/testdeploy",
                simple: false,
                exclusions: [
                    "Thumbs.db",
                    ".git",
                    ".gitignore"
                ]
            }
        },

        // Rsync Deploy
        rsync: {
            options: {
                args: ["--verbose"],
                exclusions: [
                    "Thumbs.db",
                    ".git",
                    ".gitignore"
                ],
                recursive: true,
                syncDest: true
            },
            staging: {
                options: {
                    src: "../deploy/",
                    dest: "/path/server",
                    host: "user@host.com",
                }
            },
            production: {
                options: {
                    src: "../deploy/",
                    dest: "/path/server",
                    host: "user@host.com",
                }
            }
        }
    };

    grunt.initConfig(appConfig);


    // Register tasks
    // --------------------------

    // Start server and watch for changes
    grunt.registerTask("default", ["watch"]);

     // Run build
    grunt.registerTask("runserver", ["connect", "watch"]);

    // Run build
    grunt.registerTask("build", ["jshint", "uglify", "compass"]);

    // Optimize Images
    grunt.registerTask("optimize", ["shell:imagemagick"]);

    // Deploy Methods
    grunt.registerTask("ftp", ["build", "optimize", "ftpush"]);
    grunt.registerTask("rsync", ["build", "optimize", "rsync"]);

    // Aliases Tasks
    grunt.registerTask("rs", ["runserver"]);
    grunt.registerTask("b",  ["build"]);
    grunt.registerTask("o",  ["optimize"]);
    grunt.registerTask("f",  ["ftp"]);
    grunt.registerTask("r",  ["rsync"]);

};


