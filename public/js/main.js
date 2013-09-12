/**
 * This is the main JavaScript file that loads the other modules and firest them
 * off. I am using Browserify and Common JS style modules to load them in.
 */

'use strict';

var pageSizing      = require('./modules/page-sizing')
  , navScrolling    = require('./modules/nav-scrolling')
  , stickyNav       = require('./modules/sticky-nav')
  , sectionSwapping = require('./modules/section-swapping')
  , carousel        = require('./modules/carousel')
  , options = { // global options for the site
      breakpoint: 768, // px
      maxHeight: 990, // px
      minHeight: 504 // px
    };

// Fire the modules, order is important
if (window.location.pathname === '/') { // only do all this javascript in root
  pageSizing(options);
  navScrolling();
  stickyNav(options);
  sectionSwapping(options);
  carousel();
}
