'use strict';

import * as $ from 'jquery';
const Foundation = require('foundation');

const theStickies = $('.sticky');

let isMedium: boolean;

$(document).ready(() => {
    isMedium = Foundation.MediaQuery.atLeast('medium');
});

$(window).on('resize', () => {
    setTimeout(() => {
        isMedium = Foundation.MediaQuery.atLeast('medium');
    }, 200);
});

if (theStickies.length) {
    theStickies.each(function() {
        let sticky = $(this);
        
        // Do it on load
        stickify();
        
        // And on scroll, resize
        $(window).on('scroll resize', stickify);
        
        function stickify() {
            sticky.removeAttr('style');
            if (isMedium) {
                let scrollTop = $(window).scrollTop();
                let top = sticky.offset().top;
                if (top < scrollTop) {
                    sticky.css('top', scrollTop - top);
                } else {
                    sticky.css('top', 0);
                }
            }
        }
    });
}