// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// Main anonymous function
(function(){
  'use strict';
/***************************************
 * Page load sizing
 ***************************************/
  var w = $(window);

  doResize();
  w.on('onorientationchange', doResize);

  function doResize(){

    var heroHeight = w.height() - 95
      , topMargin = (heroHeight - $('#hero > div').height()) / 2;

    // Dynamically change the height of the hero section to match the user's
    // screen height
    $('#hero').css('height', heroHeight);

    // Vertically center the hero content
    $('#headline').css('margin-top', topMargin);
  }

/***************************************
 * Nav Scrolling and Updating
 ***************************************/
  // Grab all the nav sections, loop through them when the user scrolls, and set
  // the appropriate nav item to have a class of "selected". There may be a
  // better way to do this, but I couldn't think of one.
  var items = $('#main > section,#hero')
    , offset = 92 // height of the nav
    , selected
    , arr = []
    , navItems = $('li[data-nav]');

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

/***************************************
 * Sticky Nav Bar
 ***************************************/
  var isFixed = false
    , isSmall = false
    , nav = $('nav')
    , img = $('#logo')
    , navBottom = nav.length && nav.offset().top
    , imgTop = img.offset().top
    , spacer = $('#nav-spacer');
    // 70px different for the logo

  w.on('scroll',sticky);
  w.on('touchmove', sticky);

  function sticky(){
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

/***************************************
 * Services Swapping
 ***************************************/
$('.swapper > li').click(function(){
  var me = $(this)
    , text = me.data('service')
    , target = $('.swappable section[data-service="' + text + '"]');
  console.log(me, text, target);
  $('.swappable section').addClass('gone');
  target.removeClass('gone');
});


/***************************************
 * Swipeshow
 ***************************************/
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



}());

/***************************************
 * Currently Not Using
 ***************************************/

/*!
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

// (function( $ ){

//   $.fn.fitText = function( kompressor, options ) {

//     // Setup options
//     var compressor = kompressor || 1,
//         settings = $.extend({
//           'minFontSize' : Number.NEGATIVE_INFINITY,
//           'maxFontSize' : Number.POSITIVE_INFINITY
//         }, options);

//     return this.each(function(){

//       // Store the object
//       var $this = $(this);

//       // Resizer() resizes items based on the object width divided by the compressor * 10
//       var resizer = function () {
//         $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
//       };

//       // Call once to set.
//       resizer();

//       // Call on resize. Opera debounces their resize by default.
//       $(window).on('resize.fittext orientationchange.fittext', resizer);

//     });

//   };

// })( jQuery );
