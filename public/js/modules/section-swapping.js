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
