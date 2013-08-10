# CSG Pro Website

This repo contains the working files for the new CSG Pro website.

## Folder descriptions

- node_modules
  - This contains all the 3rd party libraries that the site relies on, they are managed by a program that comes with node called NPM (Node package manager)
- public
  - The web server dishses out static files from this folder
- routes
  - TODO
- views
  - Files in here are written in Jade. Jade is an HTML pre-processor that allows for server side templating. Most importantly, you can keep things DRY by extending views from each other. This means, for instance, that you don't have to write the header for each page.
  