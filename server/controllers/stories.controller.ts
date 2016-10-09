// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/view-matcher';
import { getStories } from '../commands/story.commands';

@controller('/stories')
class StoriesController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        
        let featuredStoriesPromise = getStories('featured');
        let storiesPromise = getStories('active', undefined, undefined, undefined, null);
        
        Promise.all([featuredStoriesPromise, storiesPromise]).then(data => {
            let featuredStories = data[0].rows;
            let stories = data[1].rows;
            reply.view(pageView('stories'), {
                title: 'Stories',
                description: '',
                stories,
                totalStories: data[1].count,
                featuredStories
            });
        });
    }
}

export default new StoriesController();