'use strict';

import * as $ from 'jquery';
const Foundation = require('foundation');

const theStickies = $('.sticky');

let isMedium: boolean;

$(document).ready(() => {
    isMedium = Foundation.MediaQuery.atLeast('medium');
});

if (theStickies.length) {
    theStickies.each(function() {
        let sticky = $(this),
            height = sticky.height(),
            top = sticky.offset().top;
        
        // Do it on load
        stickify();
        
        // And on scroll
        $(window).on('scroll', stickify);
        
        function stickify() {
            if (isMedium) {
                let scrollTop = $(window).scrollTop();
                if (top < scrollTop) {
                    sticky.css('top', scrollTop - top);
                } else {
                    sticky.css('top', 0);
                }
            }
        }
    });
}