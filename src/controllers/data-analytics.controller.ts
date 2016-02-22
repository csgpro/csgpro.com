'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

export let prefix = '/services';

dataAnalytics.title = 'Data Analytics';
export function dataAnalytics(request: hapi.Request, reply: hapi.IReply) {
    reply.view('data-analytics', { title: dataAnalytics.title, description: '' });
}