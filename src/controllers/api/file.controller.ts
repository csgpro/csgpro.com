'use strict';

// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Request from 'request';

// app
import { MAX_FILE_SIZE, uploadFile, getUrl } from '../../commands/file.commands';

create.auth = 'jwt';
create['payload'] = { maxBytes: MAX_FILE_SIZE, output: 'stream', parse: true };
create.route = '/api/file';
export function create(request: hapi.Request, reply: hapi.IReply) {
    let file = request.payload['file'];
    let filename = request.payload['file'].hapi.filename;
    uploadFile(file, filename).then(result => {
        reply({ filename: result.name, url: getUrl(request.headers['host'], result.name) });
    }).catch(err => {
        reply(boom.create(500, err.message || err));
    });
}