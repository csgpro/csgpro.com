;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint
  browser: true,
  node: true */
/*global $ */

/**
 * This is the main JavaScript file that loads the other modules and firest them
 * off. I am using Browserify and Common JS style modules to load them in.
 */

'use strict';

var pageSizing      = require('./modules/page-sizing');
var navScrolling    = require('./modules/nav-scrolling');
var stickyNav       = require('./modules/sticky-nav');
var sectionSwapping = require('./modules/section-swapping');
var carousel        = require('./modules/carousel');
var mobileNav       = require('./modules/mobile-nav');
var lightbox        = require('./modules/lightbox');
var options = {    // global options for the site
  breakpoint : 768,  // px
  maxHeight  : 990,  // px
  minHeight  : 595   // px - approx. adjusted for nav bar height
};

// Fire the modules, order is important
if (window.location.pathname === '/') { // only do all this javascript in root
  pageSizing(options);
  navScrolling();
  stickyNav(options);
  sectionSwapping(options);
  carousel();
  mobileNav(options);
} else if (/post/i.test(window.location.pathname)){ // do on "post" pages
  lightbox();
}


},{"./modules/carousel":2,"./modules/lightbox":3,"./modules/mobile-nav":4,"./modules/nav-scrolling":5,"./modules/page-sizing":6,"./modules/section-swapping":7,"./modules/sticky-nav":8}],2:[function(require,module,exports){
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
/*jslint
  browser: true,
  node: true */
/*global $ */

'use strict';

function init() {
  // Fix the images so they are contained by links to the image
  $('.article img').each(function(index, element) {
    var newElement = document.createElement('a');
    var parent = element.parentNode;
    var link = element.attributes['src'].value;

    newElement.setAttribute('href', link);
    newElement.setAttribute('class', 'lightboxed');
    newElement.appendChild(element.cloneNode(true));
    parent.replaceChild(newElement, element);
  });

  $('.article .lightboxed').magnificPopup({
    type:'image',
    gallery: {
      enabled: true,
      navigateByImageClick: true
    }
  });

}


module.exports = init;
},{}],4:[function(require,module,exports){
'use strict';

function init(options) {
  var toggle = $('.toggle-nav');
  var bdy = $('body');
  var brk = options.breakpoint;
  var links = $('.mobile-nav a');
  var mainBody = $('.main-body');

  toggle.on('click',function(){
    var pageWidth = document.documentElement.clientWidth;

    if (pageWidth <= brk) { // on a mobile
      bdy.toggleClass('nav-open');
    }
    
  });

  links.on('click', function(){
    bdy.removeClass('nav-open');
  });

}

module.exports = init;

},{}],5:[function(require,module,exports){
/*jslint
  node: true,
  browser: true */ /*globals $*/
/**
 * This module sets up the events necessary to allow the user to scroll around
 * the page and have the nav update appropriately. It assumes:
 * - jQuery 1.10.2
 */

'use strict';

// Grab all the nav sections, loop through them when the user scrolls, and set
// the appropriate nav item to have a class of "selected". There may be a
// better way to do this, but I couldn't think of one.
var items = $('#hero,#work,#services,#about,#updates,#contact')
  , offset = 92 // height of the nav
  , w = $(window)
  , selected
  , arr = []
  , navItems = $('li[data-nav]');

function init() {
  
  recalcTops();

  w.on('scroll', each);
  w.on('touchmove', each);

  // When the user changes screen size, we have to re calculate the tops of each
  // of the sections
  w.on('orientationchange', recalcTops);
  w.on('resize', recalcTops);

  // Check if the user has a hash in their address bar, if so, try to nav there
  if (window.location.hash !== '') {
    var element = $(window.location.hash);

    scrollTo(element);
  }


  // When a user clicks on a nav item, scroll to that section. Should probably
  // be using anchors instead of this klugy method, but it works for now
  $('nav li').on('click', function(e){
    var element = $('#' + e.currentTarget.innerHTML);

    scrollTo(element);
  });

  // Scroll to the top of the page
  $('#logo').on('click', function(e){
    $('html, body').animate({
      scrollTop: 0
    });
  });
}

function scrollTo(element) {
  $('html, body').animate({
    scrollTop: element.offset().top - offset
  });
}

function recalcTops(){
  arr = [];

  w.off('scroll', each);
  w.off('touchmove', each);

  items.each(function(i, e){
    arr.push({
        element: e
      , name: e.id
      , top: $(e).offset().top
      , bottom: $(e).offset().top + e.offsetHeight
    });
  });

  w.on('scroll', each);
  w.on('touchmove', each);

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

////////////
// Helper //
////////////
function log() {
  var toLog = '';
  Array.prototype.forEach.call(arguments, function(item) {
    toLog += item + ' - ';
  });

  console.log(toLog);
}



},{}],6:[function(require,module,exports){
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
  }else { // mobile
    // undo the page sizing
    $('#work').removeAttr('style');
    $('#updates').removeAttr('style');
  }

}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

},{}],7:[function(require,module,exports){
/**
 * This module finds all the specially marked up sections in the html and makes
 * them swap their content based on associated navigation elements. It also
 * handles the accordion when visitors are past the mobile breakpoint.
 * 
 * Assumes:
 * - jQuery 1.10.2
 */

'use strict';

function init(options){
  $('.swapper > li').click(function(){
    var me = $(this)
      , text = me.attr('id').match(/swapper-(\w+)/)[1]
      // TODO: replace the data-swipe selector with an ID selector. Much faster
      // , target = $('.swappable section[data-swap="' + text + '"]') // slow?
      , target = $('#swappable-' + text)
      , brk = options.breakpoint
      , pageWidth = document.documentElement.clientWidth;

    document.greer = me;
    me.addClass('active');
    me.siblings().removeClass('active');
    if (pageWidth < brk) { // mobile
      var isAccordion = /accordion/.test(me.parent()[0].className);
      if (isAccordion) {
        // WIP
        var contentElements = $('.swappable section[data-swap="' + text + '"] p')
          , titleElement = $('.swappable section[data-swap="' + text + '"] .title')
          , title = titleElement[0].innerText
          , body = $('li[data-swap="'+ text +'"] section');

        console.log(contentElements, title, body);
        contentElements.each(function(i,e){
          console.log(e);
        })
      }
      // something mobile
    } else {               // desktop
      target.siblings().addClass('gone');
      target.removeClass('gone');
    }
  });
}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;

},{}],8:[function(require,module,exports){
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
  , brk //options
  , pageWidth
  , navTop
  , imgTop;
  // 70px different for the logo

function init(options) {
  brk = options.breakpoint;

  navTop = nav.offset().top;
  imgTop = img.offset().top;

  sticky();
  w.on('scroll', sticky);
  w.on('touchmove', sticky);
  w.on('resize', recalc);
}

function sticky() {
  pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk){
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
}

function recalc() {
  pageWidth = document.documentElement.clientWidth;

  if (pageWidth >= brk) {
    if (isFixed) {
      navTop = spacer.offset().top;
      imgTop = navTop - 50;
      sticky();
    } else {
      navTop = nav.offset().top;
      imgTop = img.offset().top;
    }
  }
}

///////////////////
// MODULE EXPORT //
///////////////////
module.exports = init;

},{}]},{},[1])
;