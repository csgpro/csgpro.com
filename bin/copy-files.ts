'use strict';

import * as _ from 'lodash';
import * as fs from 'fs';
const copyFiles = require('copy');
const hound = require('hound');

const filesGlob = process.argv.splice(2);

let outDir = '.';
let srcDir = '.';

const outDirIdx = _.findIndex(filesGlob, (value) => {
    return value === '--outDir';
});

if (outDirIdx != -1) {
    outDir = filesGlob[outDirIdx+1];
    filesGlob.splice(outDirIdx, outDirIdx+1);
} else {
    console.error('Missing --outDir');
    process.exit(1);
}

const srcDirIdx = _.findIndex(filesGlob, (value) => {
    return value === '--srcDir';
});

if (srcDirIdx != -1) {
    srcDir = filesGlob[srcDirIdx+1];
    filesGlob.splice(srcDirIdx, srcDirIdx+1);
} else {
    console.error('Missing --srcDir');
    process.exit(1);
}

const watchIdx = _.findIndex(filesGlob, (value) => {
    return value === '--watch';
});

if (watchIdx != -1) {
    filesGlob.splice(watchIdx);
    watchFiles();
} else {
    moveFiles();
}

function moveFiles() {
    console.log('moving files');
    copyFiles([`${srcDir}/**/*.*`], outDir, (err, file) => {
        if (err) {
            console.log('Error', err);
            process.exit(1);
        }
    });
}

function watchFiles() {
    let watcher = hound.watch(srcDir);
    moveFiles();
    
    watcher.on('create', function(file: string, stats: fs.Stats) {
        console.log(file + ' was created');
        moveFiles();
    });
    
    watcher.on('change', function(file: string, stats: fs.Stats) {
        console.log(file + ' was changed');
        moveFiles();
    });
    
    watcher.on('delete', function(file: string, stats: fs.Stats) {
        console.log(file + ' was deleted');
        moveFiles();
    });
}