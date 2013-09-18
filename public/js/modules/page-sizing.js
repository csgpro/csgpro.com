/*jslint
  browser: true,
  node: true */
/*global $ */

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
  pageWidth = w.width();

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

  // pageWidth = document.documentElement.clientWidth;
  pageWidth = w.width();

  if (pageWidth >= brk) { //desktop
    var wHeight = w.height()
      , heroHeight = wHeight - 90
      , topMargin = (heroHeight - headlineHeight) / 2
      , body = $(body);

    // Make sure the mobile nav is hidden
    body.removeClass('nav-open');

    // Dynamically change the height of the hero section to match the user's
    // screen height
    $('#hero').css('height', heroHeight);
    
    if (wHeight <= maxHeight && wHeight >= minHeight) {
      $('#work').css('height', heroHeight);
      // $('#services').css('height', heroHeight); // don't resize this section
      // $('#about').css('height', heroHeight);    // don't resize this section
      $('#updates').css('height', heroHeight);
      // $('#contact').css('height', heroHeight);  // don't resize this section
    }

    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);
  } else { // mobile
    // undo the page sizing
    $('#work').removeAttr('style');
    $('#updates').removeAttr('style');
  }

}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
