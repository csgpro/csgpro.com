// libs
import {compose} from 'glue';
import {Server} from 'hapi';

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config(); // Load environment variables
}

// app
import { get } from './manifest';
import * as db from './database';

compose(get('/'), { relativeTo: __dirname }, async (err, server) => {
    const web = server.select('web');
    if (module.parent && process.env.NODE_ENV === 'development') return;
    await db.init(server);
    server.start(() =>
        server.log('info', 'Server running at: ' + (<Server>web).info.uri)
    );
});
