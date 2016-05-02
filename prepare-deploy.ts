'use strict';

import * as fs from 'fs';

let ignoreFile = fs.readFileSync('.gitignore');

let content = ignoreFile.toString().replace(/(\*\.[css|js]{2,3})\s/g, (match) => {
    return `# ${match}`;
});

content += '\n*.ts'; // Ignore TypeScript files

console.log('Updating .gitignore', '\n', content);

fs.writeFile('.gitignore', content, 'utf8', err => {
    if (err) return console.log(err);
});