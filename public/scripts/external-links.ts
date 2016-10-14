'use strict';

import * as $ from 'jquery';

$('a').filter(function() { return this.hostname && this.hostname !== location.hostname; }).attr('target', '_blank');

