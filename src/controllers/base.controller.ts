'use strict';

import { Context, IContextComposer } from './context';

export var getHomepageContext: IContextComposer = function getHomepageContext(cb) {
    let context = new Context('home', 'Home', 'Home Description');
    cb(null, context);
};