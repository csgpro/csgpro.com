// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/utility';

type Season = 'portland-winter' | 'portland-spring' | 'portland-summer' | 'portland-fall';

@controller('/about')
class AboutController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];


    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        let headerImage = AboutController.getSeasonalHeader();
        reply.view(pageView('about'),
        {
            title: 'About CSG Pro',
            description: '',
            header: headerImage
        },
        { layout: 'hero-layout' });
    }

    static getSeasonalHeader(): Season {
        const month = new Date().getMonth() + 1;

        if (month <= 2 || month === 12) {
            // Winter!
            return 'portland-winter';
        } else if (month >= 3 && month <= 6) {
            // Spring!
            return 'portland-spring';
        } else if (month >= 7 && month <= 8) {
            // Summer!
            return 'portland-summer';
        } else {
            // Fall!
            return 'portland-fall';
        }
    }
}

export default new AboutController();