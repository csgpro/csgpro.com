// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { getStories } from '../../commands/story.commands';

@controller('/api/story')
class StoryController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/')
    @config({
        auth: 'jwt'
    })
    getStoriesApi(request: hapi.Request, reply: hapi.IReply) {
        let lastIndex: number;
        if (request.params['lastIndex'] && !isNaN(Number(request.params['lastIndex']))) {
            lastIndex = Number(request.params['lastIndex']);
        }
        let limit: number;
        if (request.params['offset'] && !isNaN(Number(request.params['offset']))) {
            limit = Number(request.params['limit']);
        }
        let offset: number;
        if (request.params['offset'] && !isNaN(Number(request.params['offset']))) {
            offset = Number(request.params['offset']);
        }
        let sortOrder: any = request.params['sortOrder'];
        let search = request.params['search'];
        getStories('active', search, sortOrder, offset, limit).then(stories => {
            reply({ data: stories });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }
}

export default new StoryController();