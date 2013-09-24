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

    $('#hero').css('height', heroHeight);


    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);

    if (wHeight <= maxHeight && wHeight >= minHeight) {
      // Dynamically change the height of the various sections to match the user's
      // screen height
      $('#work').css('height', heroHeight);
      $('#services').css('height', heroHeight);
      $('#about').css('height', heroHeight);
      $('#updates').css('height', heroHeight);

    } else if (wHeight >= maxHeight) { // still desktop, but above the bounds
      $('#work').css('height', maxHeight + 'px');
      $('#services').css('height', maxHeight + 'px');
      $('#about').css('height', maxHeight + 'px');
      $('#updates').css('height', maxHeight + 'px');
    } else if (wHeight <= minHeight) { // still desktop, but below the bounds
      $('#work').css('height', minHeight + 'px');
      $('#services').css('height', minHeight + 'px');
      $('#about').css('height', minHeight + 'px');
      $('#updates').css('height', minHeight + 'px');
    }

  } else { // mobile
    // undo the page sizing
    $('#hero').removeAttr('style');
    $('#work').removeAttr('style');
    $('#services').removeAttr('style');
    $('#about').removeAttr('style');
    $('#updates').removeAttr('style');
  }

}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
