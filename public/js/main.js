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
  , options = {
      breakpoint: 768
    };

// Fire the modules, order is important
pageSizing(options);
navScrolling();
stickyNav();
sectionSwapping(options);
carousel();