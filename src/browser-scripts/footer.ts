'use strict';

import * as $ from 'jquery';

const $footer = $('.main-footer');
const $window = $(window);

setFooterPosition();
$window.on('resize', setFooterPosition);

function setFooterPosition() {
    
    $footer.removeAttr('style');

    let $footerBottomPosition = $footer.offset().top + $footer.outerHeight();

    if ($window.innerHeight() > $footerBottomPosition) {
        $footer.css({ position: 'fixed', bottom: '0'});
    }
    
}