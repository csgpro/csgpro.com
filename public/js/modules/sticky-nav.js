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
  , o //options
  , navTop
  , imgTop;
  // 70px different for the logo

function init(options) {
  o = options;

  navTop = nav.offset().top;
  imgTop = img.offset().top;

  sticky();
  w.on('scroll', sticky);
  w.on('touchmove', sticky);
  w.on('resize', recalc);
}

function sticky() {

  if (w.scrollTop() >= navTop && !isFixed) {
    isFixed = true;
    nav.addClass('fixed-menu');
    spacer.removeClass('hidden');
  } else if (w.scrollTop() < navTop && isFixed) {
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

function recalc() {
  navTop = spacer.offset().top;
  imgTop = navTop - 50;
  sticky();
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;
