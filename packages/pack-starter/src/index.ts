/**
 * 主入口文件
 * 导出所有公共API
 */

export { ConfigLoader } from './config/loader';
export { WebpackBuilder } from './build/webpack';
export { PluginManager } from './plugins/manager';
export { builtinPlugins } from './plugins/builtin';
export { Service } from './services';
export { logger, Logger, LogLevel } from './utils/logger';
export { FileUtils } from './utils/file';

export type {
  PackConfig,
  BuildConfig,
  CliOptions,
  BuildContext,
  Plugin,
  PluginConfig,
  PluginContext,
  DevServerConfig,
  ProxyConfig,
  Environment,
  BuildMode
} from './types';

// 导出CLI相关
export * from './cli';
