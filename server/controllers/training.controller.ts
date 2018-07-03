// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/utility';
import { getPostsByTopic } from '../commands/post.commands';

@controller('/training')
class TrainingController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        getPostsByTopic(['business-analytics']).then((posts) => {
            reply.view(pageView('training'), {
                title: 'Training',
                description: '',
                posts
            },
            { layout: 'hero-layout'});
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }
}

export default new TrainingController();