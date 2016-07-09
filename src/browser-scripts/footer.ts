'use strict';

import * as $ from 'jquery';

const $footer = $('.main-footer');
const $window = $(window);

setFooterPosition(true);
$window.on(<any>'resize', setFooterPosition);

function setFooterPosition(firstRun?: boolean) {
    
    if ($('.technologies').length) return;
    
    if (firstRun) {
        setTimeout(setFooterPosition, 500);
    }
    
    $footer.removeAttr('style');

    let $footerBottomPosition = $footer.offset().top + $footer.outerHeight();

    if ($window.innerHeight() > $footerBottomPosition) {
        $footer.css({ position: 'fixed', bottom: '0'});
    }
    
}