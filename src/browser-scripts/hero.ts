'use strict';

import * as $ from 'jquery';

const hero = $('.hero.expand');

function resizeHero() {
    if (!hero.length) return;
    
    const img = hero.find('img').first();
    const intro = hero.find('.intro').first();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let topBar = $('.top-bar');
    
    if (topBar.css('display') === 'none') {
        topBar = $('.title-bar');
    }
    
    if (!hero.attr('style') || (hero.attr('style') && hero.attr('style').indexOf('height') === -1)) {
        hero.height(hero.outerHeight());
    }
    
    if (viewportHeight > 480 && viewportWidth > 480) {
        const newHeroHeight = Math.ceil(viewportHeight - topBar.outerHeight() - $('.technologies').outerHeight());
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
    }, 100);
});