// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/view-matcher';

type Season = 'portland-winter' | 'portland-spring' | 'portland-summer' | 'portland-fall';

@controller('/about')
class AboutController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    pageContent = `
<p class="paragraph-primary">CSG Pro builds modern software solutions that expand knowledge through
a more informed and visual use of data. Through Business Analytics and Custom Software Solutions, CSG Pro
delivers value by helping clients intelligently bring together, analyze and visualize data to make informed
decisions and streamline their business processes. We integrate cloud and mobile as appropriate to allow
for scale, enhance the user’s experience and ensure long-term payoff.</p>

CSG Pro maintains an active Microsoft Partner status with a Gold Application Development Competency.
CSG Pro's commitment to learning is highlighted by active participation and leadership in monthly
Power BI and Typescript meet ups.

Headquartered in Portland Oregon's urban, tech savvy Pearl District, CSG Pro is committed to delighting its
clients through the innovative application of modern technology solutions. We hope to have the opportunity
to build something amazing for you today, as we have for many since 1993.
    `;

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        let headerImage = AboutController.getSeasonalHeader();
        reply.view(pageView('about'),
        {
            title: 'About CSG Pro',
            description: '',
            header: headerImage,
            pageContent: this.pageContent
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