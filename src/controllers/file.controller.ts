'use strict';

// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Request from 'request';

// app
import { getBlobUrl, doesBlobExist, getBlobProperties } from '../commands/file.commands';

export function read(request: hapi.Request, reply: hapi.IReply) {
    let filename: string = request.params['slug'];
    let url = getBlobUrl(filename);
    doesBlobExist(filename, (error, result, response) => {
        if (error) {
            reply(boom.create(500, error.message));
            return;
        }
        if (!result.exists) {
            reply(boom.notFound());
            return;
        }
        getBlobProperties(filename, (error, result, response) => {
            let contentType = result.contentSettings.contentType;
            Request(url).on('response', (response) => {
                reply(response).header('Content-Type', contentType);
            });
        });
    });
}