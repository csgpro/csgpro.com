/**
 * This module looks for sections that need to be turned into an accordion if
 * the user is past our breakpoint
 * - jQuery 1.10.2
 */
'use strict';

var brk;

function init(options) {
  var pageWidth = document.documentElement.clientWidth;
  brk = options.breakpoint;

  if (pageWidth < brk) {
    
    
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
