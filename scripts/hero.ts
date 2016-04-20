'use strict';

import $ = require('jquery');

const hero = $('.hero');

function resizeHero() {
    if (!hero.length) return;
    
    const img = hero.find('img').first();
    const intro = hero.find('.intro').first();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    if (viewportHeight > 480 && viewportWidth > 480) {
        const newHeroHeight = Math.ceil(viewportHeight - $('.top-bar').outerHeight());
        const difference = newHeroHeight - intro.outerHeight();
        
        intro.css({ marginTop: Math.floor(difference / 2), marginBottom: Math.floor(difference / 2) });
        hero.height(newHeroHeight);
        img.css({ height: newHeroHeight, width: 'auto', maxWidth: 'none' });
    } else {
        intro.css({ marginTop: 0, marginBottom: 0 });
        hero.css('height', 'auto');
        img.css({ height: 'auto', width: 'auto', maxWidth: '100%', minWidth: '100%' });
    }
}

$(window).on('load resize orientationchange', () => {
    setTimeout(() => {
        resizeHero();
    }, 500);
});