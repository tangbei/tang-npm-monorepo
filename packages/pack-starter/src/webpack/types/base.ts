import * as Config from 'webpack-chain';

import { WebpackConfig } from '../../types';

export interface IBaseOpts {
  isProd: boolean;
  env?: Env;
  config: Config;
  showProgress: boolean;
  userWebpackConfig: WebpackConfig;
  [key: string]: unknown;
}

export enum Env {
  development = 'dev',
  production = 'prod',
}
