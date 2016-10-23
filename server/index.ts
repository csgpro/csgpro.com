// libs
import {compose} from 'glue';
import {Server} from 'hapi';
import {join} from 'path';
import {existsSync} from 'fs';

if (existsSync(join(__dirname, '..', '.env'))) {
    require('dotenv').config(); // Load environment variables
}

// app
import { get } from './manifest';

compose(get('/'), { relativeTo: __dirname }, (err, server) => {
    const web = server.select('web');
    server.start(() =>
        server.log('info', 'Server running at: ' + (<Server>web).info.uri)
    );
});
