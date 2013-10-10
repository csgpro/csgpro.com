# CSG Pro Website
This repo contains the working files for the new CSG Pro website.

[Production site](http://csgprod.azurewebsites.net)

[Development site](http://csgdev.azurewebsites.net)

## Dependencies
This site runs on node.js. To see which version, check the `package.json` manifest file. It contains references to all the various modules and programs the site depends on. Here are the steps you'll need to get up and running:

1. Install [node.js](http://nodejs.org/). See `package.json` for the correct version.
2. Navigate to the root folder and run `npm install`. This will install all the dependencies to run the site. On Linux I had to run the command twice to get it to work right.
3. Create a `config.json` file in the root folder. This will contain all the secretz your site needs to be happy. *See our production Azure settings for the necessary keys.*
4. I suggest installing the grunt runner globally with `npm install -g grunt-cli`. Then you can run `grunt` in the root folder to do all the minifaction, pre-compiling, etc...
5. Run the site with `node app.js`

**Note**: some of the images may not load correctly if you are using a case-sensitive file system such as Linux. Minor changes to the markup would fix this.

## Deployments
We have GitHub service hooks setup to automatically deploy the `dev` and `master` branches to Azure when changes are pushed to this repo. That means, be careful when pushing changes as they will automatically be sucked up by Azure and deployed.

When changes are deployed to Azure, you must hit the website with your browser to "warm it up."

## Folder descriptions

### modules
This folder contains various modules that are loaded in throughout the app to provide different *modules* of functionality. For instance, the `db.js` module exports a bunch of the functions that allow the other parts of the app to communicate with the database. `email.js` does what you think it would, it exports functions that let you send emails.

### node_modules
This contains all the 3rd party libraries that the site relies on, they are managed by a program that comes with node called NPM (Node package manager). This folder is excluded from source control because it is filled automatically by npm. It can be created by running `npm install` from the command line.

### public
The web server dishes out static files from this folder. Some of the images assets and other client-side libraries live in here. Not all the assets are contained in this folder. Many of the larger images are stored in the Azure blob storage.

### routes
The routes folder could also be thought of as the *controllers* folder.

### views
Files in here are written in Jade. Jade is an HTML pre-processor that allows for server side templating. Most importantly, you can keep things DRY by extending views from each other. This means, for instance, that you don't have to write the header for each page.
