'use strict';

import * as $ from 'jquery';
require('./hero');
require('./contact-form');
require('./download-form');
require('./external-links');
require('./footer');

setTimeout(() => {
    $(document).foundation();
}, 500);
