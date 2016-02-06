'use strict';

import * as sass from 'node-sass';
import * as path from 'path';
import * as fs from 'fs';

const srcFile = 'styles/main.scss';
const destFile = 'public/styles/main.css';

sass.render({
    file: srcFile,
    sourceMapEmbed: true,
    outputStyle: 'compressed'
}, (err, result) => {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        // No errors during the compilation, write this result on the disk
        fs.writeFile(destFile, result.css, function(err){
            if(err){
                console.error(err);
                process.exit(1);
            }
        });
    }
});