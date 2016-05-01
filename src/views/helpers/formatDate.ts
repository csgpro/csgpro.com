'use strict';

import * as moment from 'moment';

function formatDate(date: string | Date, format = 'MM/DD/YYYY'): string {
    if (arguments.length <= 2) {
        date = new Date();
        if (typeof arguments[0] === 'string') {
            format = arguments[0];
        }
    }
    return moment(date).format(format);
}

export = formatDate;