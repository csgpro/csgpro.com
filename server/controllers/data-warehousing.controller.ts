// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';
import * as rq from 'request';

// app
import { pageView } from '../shared/utility';
import { getPostsByTopic } from '../commands/post.commands';

@controller('/data-warehousing')
class DataWarehousingController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        getPostsByTopic(['business-analytics']).then((posts) => {
            var embedToken = "";
            var embedReportId = "";
            var embedAppWorkspaceId = "";

            rq.get(
                'https://csgembed.azurewebsites.net/api/EmbedTokenFunction',
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {                     
                        var results = JSON.parse(body);                    
                        var embedConfig = JSON.parse(results);

                        embedToken = embedConfig.EmbedToken;
                        embedReportId = embedConfig.ReportId;
                        embedAppWorkspaceId =  embedConfig.AppWorkspaceId;                     
                    }
                }
            ).on('complete', function(data,response){
                reply.view(pageView('data-warehousing'), {
                    title: 'Data Warehousing',
                    description: '',
                    posts,
                    token: embedToken,
                    reportId: embedReportId,
                    appWorkspaceId: embedAppWorkspaceId
                },
                { layout: 'hero-layout'});
            });          
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }
}

export default new DataWarehousingController();