// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import * as path from 'path';
import { controller, get, Controller } from 'hapi-decorators';

@controller('/')
class PublicController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/img/{param*}')
    oldImagePath(request: hapi.Request, reply: hapi.IReply) {
        let path = request.path.replace('img', 'resources/images');
        reply.redirect(path);
    }

    @get('/admin/{param*}')
    admin(request: hapi.Request, reply: hapi.IReply) {
        reply.file(path.join(__dirname, '..', '..', 'public', 'admin', 'index.html'));
    }

    @get('/robots.txt')
    robots(request: hapi.Request, reply: hapi.IReply) {
        const host = request.headers['host'];
        if (!/^www.csgpro.com$/.test(host)) {
            reply.file(path.join('..', 'public', 'block-robots.txt'), <any>{ confine: false });
        } else {
            reply.file(path.join('..', 'public', 'robots.txt'), <any>{ confine: false });
        }
    }
}

export default new PublicController();