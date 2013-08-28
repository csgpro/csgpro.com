/**
 * This module is used to resize certain parts of the page based on the user
 * screen size. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

var w = $(window)
  , o; // options

function init(options) {
  o = options;
  var pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= o.breakpoint)
    doResize();

  w.on('onorientationchange', doResize);
}

function doResize(){
  var pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= o.breakpoint) {
    var heroHeight = w.height() - 95
      , topMargin = (heroHeight - $('#hero > div').height()) / 2;

    // Dynamically change the height of the hero section to match the user's
    // screen height
    $('#hero').css('height', heroHeight);

    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
