'use strict';

import * as sass from 'node-sass';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

const hound = require('hound');
const mkdirp = require('mkdirp');

const srcDir = 'src/scss',
      srcFile = `main.scss`,
      destDir = 'lib/public/styles',
      destFile = 'main.css';

const args = process.argv;

const watch = _.some(args, (value) => {
    return (value === '--watch' || value === '-w');
});

if (watch) {
    watchSass();
} else {
    renderSass();
}

function renderSass() {
    console.log('rendering sass');
    sass.render({
        file: `${srcDir}/${srcFile}`,
        sourceMapEmbed: true,
        outputStyle: 'compressed'
    }, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            mkdirp.sync(`${destDir}`);
            // No errors during the compilation, write this result on the disk
            fs.writeFile(`${destDir}/${destFile}`, result.css, function(err){
                if(err){
                    console.error(err);
                    process.exit(1);
                }
            });
        }
    });
}

function watchSass() {
    // Create a directory tree watcher.
    let watcher = hound.watch(srcDir);
    renderSass();
    
    watcher.on('create', function(file: string, stats: fs.Stats) {
        console.log(file + ' was created');
        renderSass();
    });
    
    watcher.on('change', function(file: string, stats: fs.Stats) {
        console.log(file + ' was changed');
        renderSass();
    });
    
    watcher.on('delete', function(file: string, stats: fs.Stats) {
        console.log(file + ' was deleted');
        renderSass();
    });
}