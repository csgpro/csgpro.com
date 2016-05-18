### CSG Pro Website

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### NPM Tasks

| Task | Description |
|---|---|
| "prepare-build" | "npm run clean" |
| "build" "npm run prepare-build && npm run lib-js && npm run browser-js && npm run sass && npm run public && npm run views" |
| "clean" | "rimraf ./lib/* !./lib/.gitkeep" |
| "clean-deep" | "rimraf ./src/**/*.js ./test/**/*.js ./utils/**/*.js, ./lib/* !./lib/.gitkeep !./src/public/scripts/*.js" |
| "lib-js" | "tsc" |
| "lib-js:watch" | "tsc --watch" |
| "browser-js" | "webpack" |
| "browser-js:watch" | "webpack --watch" |
| "sass" | "node lib/bin/compile-sass.js" |
| "sass:watch" | "node lib/bin/compile-sass.js --watch" |
| "public" | "node lib/bin/copy-files.js --outDir lib/public --srcDir src/public" |
| "public:watch" | "node lib/bin/copy-files.js --outDir lib/public --srcDir src/public --watch" |
| "views" | "node lib/bin/copy-files.js --outDir lib/views --srcDir src/views" |
| "views:watch" | "node lib/bin/copy-files.js --outDir lib/views --srcDir src/views --watch" |
| "test" | "mocha lib/test" |