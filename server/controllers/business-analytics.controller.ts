// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { pageView } from '../shared/utility';
import { getPostsByTopic } from '../commands/post.commands';

@controller('/business-analytics')
class BusinessAnalyticsController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
;

    powerBISamples = [
        {
            title: 'World Data',
            description: 'This chart is fully interactive and allows users to filter and compare data by country.',
            previewImageUrl: '/resources/images/powerbi/world-economy.png',
            url: 'https://app.powerbi.com/view?r=eyJrIjoiZWIzNDQ2ZDctZjRmNi00NzlkLTgxNjEtODM2Nzk5ODgyMjU2IiwidCI6IjBhY2U5YjBiLWVmYWUtNDMwNC04MTBhLTE0MTdiYmQxZDBkNiIsImMiOjZ9' 
        },
        {
            title: 'Color Theme Browser',
            description: 'Choosing the right color scheme for your Power BI chart is difficult. We want to make it easier.',
            previewImageUrl: '/resources/images/powerbi/color-theme-browser.png',
            url: 'https://app.powerbi.com/view?r=eyJrIjoiYTM3MWQ4NDktMDMwZi00ZGU2LWFlNDItYTFiZDM1ODEyNDI1IiwidCI6IjBhY2U5YjBiLWVmYWUtNDMwNC04MTBhLTE0MTdiYmQxZDBkNiIsImMiOjZ9',
            downloadFile: '/file/Color Theme Browser.zip'
        }
    ];

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        getPostsByTopic('business-analytics').then(posts => {
            reply.view(pageView('business-analytics'), {
                title: 'Business Analytics',
                description: '',
                posts,
                powerBISamples: this.powerBISamples
            },
            { layout: 'hero-layout' });
        });
    }
}

export default new BusinessAnalyticsController();