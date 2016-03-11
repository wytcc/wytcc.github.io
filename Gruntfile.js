module.exports = function(grunt) {

    // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    var lrSnippet = require('connect-livereload')({
    	port: lrPort
    });
    var lrMiddleware = function(connect, options) {
    	return [lrSnippet,
    	connect.static(options.base[0]),
    	connect.directory(options.base[0])
    	];
    };

    var pkg = grunt.file.readJSON('package.json');

    var lessFiles = function(isDev) {
    	var lessFiles = pkg.lessPath,
    	_len = lessFiles.length,
    	_result = {};
    	for (var i = 0; i < _len; ++i) {
    		var _path = lessFiles[i],
    		_dest = _path.replace(/.less$/, '.css');
    		if(!isDev) {
    			_dest = _dest.replace(/^app/, 'build');
    		}
    		_result[_dest] = _path;
    	}
    	return _result;
    }

    // 项目配置(任务配置)
    grunt.initConfig({
        // 读取我们的项目配置并存储到pkg属性中
        pkg: pkg,
        // 通过connect任务，创建一个静态服务器
        connect: {
        	options: {
        		port: '<%= pkg.port %>',
        		hostname: 'localhost',
        		base: '.'
        	},
        	livereload: {
        		options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: lrMiddleware
                }
            }
        },
        less: {
        	development: {
        		options: {
        			paths: ["css"]
        		},
        		files: lessFiles(true)
        	},
        	production: {
        		options: {
        			paths: ["build/css"],
        			compress: true,
        			modifyVars: {
        				imgPath: "\"../../app/image\""
        			}
        		},
        		files: lessFiles(false)
        	}
        },
        concat: {
        	options: {
        		separator: ';'
        	},
        	dist: {
        		src: ['app/js/d3-draw.js'],
        		dest: 'build/<%= pkg.name %>.js'
        	}
        },
        uglify: {
        	dist: {
        		files: {
        			'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        		}
        	}
        },
        // 通过watch任务，来监听文件是否有更改
        watch: {
        	less: {
        		files: ['**/*.less'],
        		tasks: ['less']
        	},
        	client: {
        		options: {
        			livereload: lrPort
        		},
        		files: ['*.html',  'app/css/*.css', 'app/js/*', 'app/images/**/*']
        	},
        }
    }); // grunt.initConfig配置完毕

    // 加载插件
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 自定义任务
    grunt.registerTask('default', ['less:development', 'connect', 'watch']);
    grunt.registerTask('build', ['less:production', 'concat', 'uglify']);
};