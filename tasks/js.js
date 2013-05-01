/**
 * js压缩任务
 */

//系统模块
var path = require('path');
var join = path.join;
var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;

var root = join(__dirname, '../');
// var name = path.basename(__filename, '.js');
//非系统模块
var feTask = require(root + '/lib/feTask');
var grunt = require('grunt');
var color = require('colors');

var Task = function() {};
util.inherits(Task, feTask);

//task依赖模块
var uglifyjs = require('uglify-js');
Task.prototype.start = function() {
    var that = this;
    if (this.dist.length === 0) {
        that.error('No source file!');

    } else {
        that.note('Start js task...');
        var gFile = grunt.file;
        var files = [];
        var dist = this.dist.filter(function(filepath) {
            if (gFile.isDir(filepath)) {
                that.note('Recurse "' + filepath + '"...');
                //这个是folder，需要遍历
                gFile.recurse(filepath, function(abspath, rootdir, subdir, filename) {
                    if (/\.js$/.test(filename)) {
                        files.push(abspath);
                    }
                });
                return false;
            } else if (!gFile.exists(filepath)) {
                that.warn('Source file "' + filepath + '" not found.');
                return false;
            } else {
                return true;
            }
        });

        dist = dist.concat(files);
        if (dist.length === 0) {
            that.error('No source file!');
        }
        if (that.options.b || that.options.beautify) {
            var content = uglifyjs.minify(dist, {
                output: {
                    comments: true,
                    bracketize: true,
                    beautify: true,
                    ascii_only:!!that.options.ascii
                }
            }).code;
        }else{
            console.log(!that.options['no-ascii']);
            var content = uglifyjs.minify(dist, {
                output: {
                    ascii_only:!that.options['no-ascii']
                }
            }).code;
        }


        gFile.write(that.dest, content);
        that.note('File "' + that.dest + '" created.');
    }
}


module.exports = new Task;