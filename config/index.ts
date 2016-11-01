// libs
import * as webpack from 'webpack';

// app
import PublicConfig from './public.config';
import AdminConfig from './admin.config';

const configurations: ReadonlyArray<webpack.Configuration> = [PublicConfig, AdminConfig];

export = configurations;
