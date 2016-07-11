### CSG Pro Website

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### Running Locally
To run the application you need to have node `v4.2.4`.

The database needs to be restored and you'll need to create a `settings.json` file in the root of the project. See [settings.sample.json](./settings.sample.json).

Open Terminal & Run:  
`npm start`

Then open your browser to `http://localhost:3000`

### NPM Tasks

| Task | Description |
|---|---|
| "start" | "node index.js" |
| "postinstall" | "npm run build" |
| "prepare-build" | "npm run clean" |
| "build" "npm run prepare-build && npm run lib-js && npm run browser-js && npm run sass && npm run public && npm run views && npm run downloads" |
| "clean" | "rimraf ./dist/* !./dist/.gitkeep" |
| "clean-deep" | "rimraf ./src/**/*.js ./test/**/*.js ./utils/**/*.js, ./dist/* !./dist/.gitkeep !./src/public/scripts/*.js" |
| "lib-js" | "tsc" |
| "lib-js:watch" | "tsc --watch" |
| "browser-js" | "webpack" |
| "browser-js:watch" | "webpack --watch" |
| "sass" | "node lib/bin/compile-sass.js" |
| "sass:watch" | "node lib/bin/compile-sass.js --watch" |
| "public" | "node lib/bin/copy-files.js --outDir lib/public --srcDir src/public" |
| "public:watch" | "node lib/bin/copy-files.js --outDir lib/public --srcDir src/public --watch" |
| "views" | "node lib/bin/copy-files.js --ext html --outDir lib/views --srcDir src/views" |
| "views:watch" | "node lib/bin/copy-files.js --ext html --outDir lib/views --srcDir src/views --watch" |
| "downloads" | "node lib/bin/copy-files.js --outDir lib/downloads --srcDir src/downloads" |
| "downloads:watch" | "node lib/bin/copy-files.js --outDir lib/downloads --srcDir src/downloads --watch" |
| "test" | "mocha lib/test" |
| "watch" | "concurrently \"npm run lib-js:watch\" \"npm run browser-js:watch\" \"npm run sass:watch\" \"npm run public:watch\" \"npm run views:watch\" \"npm run downloads:watch\"" |