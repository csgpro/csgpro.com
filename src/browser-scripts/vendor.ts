'use strict';

/**
 * Some 3rd party libaries aren't compatible with module loaders.
 * http://stackoverflow.com/a/34320472/3732163
 */
require('!!script!jquery/dist/jquery.min.js');
require('!!script!foundation-sites/dist/foundation.min.js');
require('!!script!motion-ui/dist/motion-ui.min.js');