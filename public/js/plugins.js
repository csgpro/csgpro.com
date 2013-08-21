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
/***************************************
 * Page load sizing
 ***************************************/
  var w = $(window);

  doResize();
  w.on('onorientationchange', doResize);

  function doResize(){
    // Dynamically change the height of the hero page main screen
    $('#hero').css('height', w.height() - 95);
    // Change the height of the hero text
    $('#headline').css('margin-top', w.height() / 3);
  }

/***************************************
 * Nav Scrolling and Updating
 ***************************************/
  // Grab all the nav sections, loop through them when the user scrolls, and set
  // the appropriate nav item to have a class of "selected". There may be a 
  // better way to do this, but I couldn't think of one.
  var items = $('#main section,#hero')
    , offset = 108
    , selected;

  w.on('scroll', each);
  w.on('touchmove', each);

  function each(){
    items.each(function(i, item){
      if ( (w.scrollTop() + offset) >= item.offsetTop
        && (w.scrollTop() + offset) <= (item.offsetTop + item.offsetHeight)
      ) {
        if (selected) {
          selected.removeClass('selected');
        }
        selected = $("li[data-nav='" + item.id +"']");
        selected.addClass('selected');
      }
    });
  }

  // When a user clicks on a nav item, scroll to that section. Should probably
  // be using anchors instead of this klugy method, but it works for now
  $('nav li').bind('click', function(e){
    $.smoothScroll({
      scrollTarget: '#' + this.innerText
    , offset: -97
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
