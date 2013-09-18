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

function init(options){
  $('.swapper > li').click(function(){
    var me = $(this)
      , text = me.attr('id').match(/swapper-(\w+)/)[1]
      // TODO: replace the data-swipe selector with an ID selector. Much faster
      // , target = $('.swappable section[data-swap="' + text + '"]') // slow?
      , target = $('#swappable-' + text)
      , brk = options.breakpoint
      , pageWidth = document.documentElement.clientWidth;

    document.greer = me; // DEBUG

    me.addClass('active');
    me.siblings().removeClass('active');

    if (pageWidth < brk) { // mobile
      var isAccordion = /accordion/.test(me.parent()[0].className);
      if (isAccordion) {
        // WIP
        var content = $('#swappable-' + text);
        var contentTarget = $('#swapper-' + text + ' section');

        contentTarget.html(content.children());
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
