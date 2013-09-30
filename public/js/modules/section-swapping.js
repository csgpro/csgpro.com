/*jslint
  browser: true,
  node: true */ /* globals $ */

/**
 * This module finds all the specially marked up sections in the html and makes
 * them swap their content based on associated navigation elements. It also
 * handles the accordion when visitors are past the mobile breakpoint.
 * 
 * Assumes:
 * - jQuery 1.10.2
 */

'use strict';

var options;

function init(o){
  options = o;

  $('.swapper > li').click(function(){
    swap($(this));
  });

  $('.swapper.accordion > li').each(function(index, item) {
    var text = $(item).attr('id').match(/swapper-(\w+)/)[1];
    var content = $('#swappable-' + text);
    var contentTarget = $('#swapper-target-' + text );

    contentTarget.html(content.children().clone());
    // contentTarget.children()[0].style['padding-top'] = '12px';
  });
}

function swap(element) {
  var me = element
    , text = me.attr('id').match(/swapper-(\w+)/)[1]

    // TODO: replace the data-swipe selector with an ID selector. Much faster
    // , target = $('.swappable section[data-swap="' + text + '"]') // slow?
    , target = $('#swappable-' + text)
    , brk = options.breakpoint
    , pageWidth = document.documentElement.clientWidth
    , isAccordion = /accordion/.test(me.parent()[0].className);

  if (pageWidth < brk) { // mobile
    if (isAccordion) {
      var content = $('#swappable-' + text);
      var contentTarget = $('#swapper-target-' + text );

      if (me.hasClass('active')) {
        me.removeClass('active');
        contentTarget.removeClass('active');
        // contentTarget.html('');
      } else {
        me.addClass('active');
        contentTarget.addClass('active');
        // contentTarget.html(content.children().clone());
        // contentTarget.children()[0].style['padding-top'] = '12px';
      }
    }
  } else {               // desktop
    me.addClass('active');
    me.siblings().removeClass('active');
    target.siblings().addClass('gone');
    target.removeClass('gone');
  }
}

////////////////////
// MODULE EXPORTS //
////////////////////
module.exports = init;
// DANGER global scope
window.swapElement = swap;

