/** 生成配置 */

import { IBaseOpts } from '../types';
import { addBaseRules } from './baseRules';
import mergeUserConfig from './mergeConfig';


export function setConfig(opts: IBaseOpts) {
  // 默认配置
  addBaseRules(opts);
  // 项目自定义配置
  mergeUserConfig(opts);
}
