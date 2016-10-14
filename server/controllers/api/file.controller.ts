// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as Request from 'request';
import { controller, post, config, Controller } from 'hapi-decorators';

// app
import { MAX_FILE_SIZE, uploadFile, getUrl } from '../../commands/file.commands';

@controller('/api/file')
class FileController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @post('/')
    @config({
        auth: 'jwt',
        payload:  { maxBytes: MAX_FILE_SIZE, output: 'stream', parse: true }
    })
    create(request: hapi.Request, reply: hapi.IReply) {
        let file = request.payload['file'];
        let filename = request.payload['file'].hapi.filename;
        uploadFile(file, filename).then(result => {
            reply({ data: { filename: result.name, url: getUrl(request.headers['host'], result.name) } });
        }).catch(err => {
            reply(boom.create(500, err.message || err));
        });
    }
}

export default new FileController();