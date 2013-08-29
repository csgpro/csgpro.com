;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
sectionSwapping();
carousel();
},{"./modules/carousel":2,"./modules/nav-scrolling":3,"./modules/page-sizing":4,"./modules/section-swapping":5,"./modules/sticky-nav":6}],2:[function(require,module,exports){
/**
 * This module sets up the homepage carousel. Assumes:
 * - jQuery 1.10.2
 */

'use strict';

function init(){
  $(".swipeshow").swipeshow({
    autostart: false,    /* Set to `false` to keep it steady */
    interval: 3000,     /* Time between switching slides (ms) */
    initial: 0,         /* First slide's index */
    speed: 700,         /* Animation speed (ms) */
    friction: 0.3,      /* Bounce-back behavior; use `0` to disable */
    mouse: true,        /* enable mouse dragging controls */
    keys: true,         /* enable left/right keyboard keys */

    onactivate: function(){},
    onpause: function(){},
  });
}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;

},{}],3:[function(require,module,exports){
/**
 * This module sets up the events necessary to allow the user to scroll around
 * the page and have the nav update appropriately. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

// Grab all the nav sections, loop through them when the user scrolls, and set
// the appropriate nav item to have a class of "selected". There may be a
// better way to do this, but I couldn't think of one.
var items = $('#main > div > section,#hero')
  , offset = 92 // height of the nav
  , w = $(window)
  , selected
  , arr = []
  , navItems = $('li[data-nav]');

function init() {
  items.each(function(i, e){
    arr.push({
        element: e
      , name: e.id
      , top: e.offsetTop
      , bottom: e.offsetTop + e.offsetHeight
    });
  });

  w.on('scroll', each);
  w.on('touchmove', each);

  // When a user clicks on a nav item, scroll to that section. Should probably
  // be using anchors instead of this klugy method, but it works for now
  $('nav li').on('click', function(e){
    var element = $('#' + e.currentTarget.innerHTML);

    $('html, body').animate({
      scrollTop: element.offset().top - offset
    });
  });

  $('#logo').on('click', function(e){
    $('html, body').animate({
      scrollTop: 0
    });
  });
}

function each(){
  var at = w.scrollTop() + offset + 2;

  arr.forEach(function(item){
    if ( at >= item.top && at <= item.bottom ) {
      if (selected) {
        selected.removeClass('selected');
      }
      selected = $("li[data-nav='" + item.name +"']");
      selected.addClass('selected');
    }
  });
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

},{}],4:[function(require,module,exports){
/**
 * This module is used to resize certain parts of the page based on the user
 * screen size. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

var w = $(window)
  , brk; // options

function init(options) {
  var pageWidth = document.documentElement.clientWidth;
  brk = options.breakpoint;

  if (pageWidth >= brk)
    doResize();

  w.on('onorientationchange', doResize);
}

function doResize(){
  var pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk) {
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

},{}],5:[function(require,module,exports){
/**
 * This module finds all the specially marked up sections in the html and makes
 * them swap their content based on associated navigation elements. Assumes:
 * - jQuery 1.10.2
 */

'use strict';

function init(){
  $('.swapper > li').click(function(){
    var me = $(this)
      , text = me.data('swap')
      , target = $('.swappable section[data-swap="' + text + '"]');
    me.addClass('active');
    me.siblings().removeClass('active');
    target.siblings().addClass('gone');
    target.removeClass('gone');
  });
}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;

},{}],6:[function(require,module,exports){
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

},{}]},{},[1])
;