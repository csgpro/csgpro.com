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
  var at = w.scrollTop() + (w.height() / 2);

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


