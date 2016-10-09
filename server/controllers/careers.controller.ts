// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { getPost, getPostsByCategory, getTopics } from '../commands/post.commands';

@controller('/careers')
class CareersController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/{page?}')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        let promises: Promise<any>[] = [];
        let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
        let limit = 10;
        let offset = page <= 1 ? 0 : (page * limit) - limit;
        
        getPostsByCategory('career', true, undefined, offset, limit).then(posts => {
            reply.view('category', {
                title: 'Careers',
                description: '',
                posts,
                pagination: { basePath: '/careers', pageCount: Math.ceil(posts['count'] / limit), page } });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/{year}/{month}/{slug}')
    read(request: hapi.Request, reply: hapi.IReply) {
        let postSlug: string = request.params['slug'];
        getPost(postSlug, 'career').then(job => {
            if (!job) {
                reply(boom.notFound());
            }
            let jobJSON = job.toJSON();
            reply.view('post', { title: jobJSON.title, post: jobJSON }, { layout: 'hero-layout' });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }
}

export default new CareersController();