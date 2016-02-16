'use strict';

import * as moment from 'moment';

function formatDate(date: string, format?: string): string {
    let f = 'MM/DD/YYYY';
    let d = date;
    if (typeof format === 'string') {
        f = format;
    }
    return moment(d).format(f);
}

export = formatDate;