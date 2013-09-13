/**
 * This module is used to resize certain parts of the page based on the user
 * screen size. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

var w = $(window)
  , brk // options
  , maxHeight
  , minHeight
  , headlineHeight = 0
  , pageWidth;

function init(options) {
  pageWidth = document.documentElement.clientWidth;

  // Get necessary options
  brk = options.breakpoint;
  maxHeight = options.maxHeight;
  minHeight = options.minHeight;

  headlineHeight = $('#hero > div').height();

  if (pageWidth >= brk)
    doResize();

  w.on('onorientationchange', doResize);
  w.on('resize', doResize);
}

function doResize(){
  pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk) {
    var wHeight = w.height()
      , heroHeight = wHeight - 90
      , topMargin = (heroHeight - headlineHeight) / 2;

    // Dynamically change the height of the hero section to match the user's
    // screen height
    $('#hero').css('height', heroHeight);
    if (wHeight <= maxHeight && wHeight >= minHeight) {
      $('#work').css('height', heroHeight);
      // $('#services').css('height', heroHeight);
      // $('#about').css('height', heroHeight);
      $('#updates').css('height', heroHeight);
      // $('#contact').css('height', heroHeight); // don't resize this section
    }

    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
