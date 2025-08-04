/** 设置webpack配置，结合内置配置、项目自定义配置 */

import * as env from '../utils/env';
import { setConfig } from './config';
import { IBaseOpts } from './types/index.js';

export function setDefaultConfig(opts: IBaseOpts): void {
  // 获取项目自定义配置、config对象
  const { userWebpackConfig, config, showProgress } = opts;
  setConfig({ isProd: env.isProd(), config, userWebpackConfig, showProgress });
}
