/**
 * This module is used to make the navigations fixed when the user hits a
 * certain spot on their scrolling. It assumes:
 * - jQuery 1.10.2
 */
'use strict';

var isFixed = false
  , isSmall = false
  , w = $(window)
  , nav = $('nav')
  , img = $('#logo')
  , spacer = $('#nav-spacer')
  , o; //options
  // 70px different for the logo

function init(options) {
  o = options;
  // Only store these variables when the page is first loaded
  var navBottom = nav.length && nav.offset().top
    , imgTop = img.offset().top;

  sticky(navBottom, imgTop);

  w.on('scroll', function(){
    sticky(navBottom, imgTop);
  });
  w.on('touchmove', function(){
    sticky(navBottom, imgTop);
  });
}

function sticky(navBottom, imgTop){
  if (w.scrollTop() >= navBottom && !isFixed){
    isFixed = true;
    nav.addClass('fixed-menu');
    spacer.removeClass('hidden');
  } else if (w.scrollTop() < navBottom && isFixed) {
    isFixed = false;
    nav.removeClass('fixed-menu');
    spacer.addClass('hidden');
  }

  if (w.scrollTop() >= imgTop && !isSmall) {
    isSmall = true;
    img.addClass('small-logo');
    img.removeClass('big-logo');
  } else if (w.scrollTop() < imgTop && isSmall) {
    isSmall = false;
    img.removeClass('small-logo');
    img.addClass('big-logo');
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
