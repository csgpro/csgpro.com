// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

@controller('/')
class MainController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        reply.view('home', { title: 'Custom Software, Business Analytics, and Cloud Services', description: `Headquartered in Portland Oregon's urban, tech savvy Pearl District, CSG Pro is committed to delighting its clients through the innovative application of modern technology solutions. We hope to have the opportunity to build something amazing for you today, as we have for many since 1993.` }, { layout: 'hero-layout' });
    }
}

export default new MainController();