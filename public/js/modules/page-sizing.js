/**
 * This module is used to resize certain parts of the page based on the user
 * screen size. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

var w = $(window)
  , brk // options
  , headlineHeight = 0;

function init(options) {
  var pageWidth = document.documentElement.clientWidth;

  brk = options.breakpoint;
  headlineHeight = $('#hero > div').height();

  if (pageWidth >= brk)
    doResize();

  w.on('onorientationchange', doResize);
  w.on('resize', doResize);
}

function doResize(){
  var pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk) {
    var heroHeight = w.height() - 95
      , topMargin = (heroHeight - headlineHeight) / 2;

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
