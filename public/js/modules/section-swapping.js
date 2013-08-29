/**
 * This module finds all the specially marked up sections in the html and makes
 * them swap their content based on associated navigation elements. Assumes:
 * - jQuery 1.10.2
 */

'use strict';

function init(options){
  $('.swapper > li').click(function(){
    var me = $(this)
      , text = me.data('swap')
      // TODO: replace the data-swipe selector with an ID selector. Much faster
      , target = $('.swappable section[data-swap="' + text + '"]') // slow?
      , brk = options.breakpoint
      , pageWidth = document.documentElement.clientWidth;

    me.addClass('active');
    me.siblings().removeClass('active');
    if (pageWidth < brk) { // mobile
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
