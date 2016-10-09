// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Request from 'request';
import { controller, get, Controller } from 'hapi-decorators';

// app
import { getBlobUrl, doesBlobExist, getBlobProperties } from '../commands/file.commands';

@controller('/file')
class FileController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/{slug}')
    read(request: hapi.Request, reply: hapi.IReply) {
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
}

export default new FileController();