### CSG Pro Website

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Build Status](https://travis-ci.org/csgpro/csgpro.com.svg?branch=master)](https://travis-ci.org/csgpro/csgpro.com)
[![NSP Status](https://nodesecurity.io/orgs/csg-pro/projects/fa8a9d6e-9137-4db1-8245-82547db77603/badge)](https://nodesecurity.io/orgs/csg-pro/projects/fa8a9d6e-9137-4db1-8245-82547db77603)

### Running Locally
To run the application you need to have node `v6.7.0`.

The database needs to be restored and you'll need to create a `settings.json` file in the root of the project. See [settings.sample.json](./settings.sample.json).

### Prerequisites
1. Node v6.7.0 or higher
2. Restore database backup
3. Rename `sample.env` to `.env` & set appropriate values

Open Terminal & Run:  
`npm start`

Then open your browser to `http://localhost:3000`
