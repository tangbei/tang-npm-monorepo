import { PluginOptions } from 'copy-webpack-plugin';
import type * as Config from 'webpack-chain';
import type WebpackDevServer from 'webpack-dev-server';
import { PluginAPI } from '../plugins/PluginAPI';

/**
 * 脚手架核心类型定义
 */
// 环境类型
export type Environment = 'development' | 'production' | 'test';

// 构建模式
export type BuildMode = 'development' | 'production';

export type CommonObject<T> = {
  [key: string]: T;
};

export enum ICommandName {
  INIT = 'init',
  BUILD = 'build',
  SERVE = 'serve',
  CLEAN = 'clean',
  PLUGINS = 'plugins'
}

export interface ICommand {
  name: string;
  alias?: string;
  description?: string;
  details?: string;
  fn: (args: Record<string, string>) => void;
}

export interface IDep {
  [name: string]: string;
}

export interface IPackage {
  name?: string;
  dependencies?: IDep;
  devDependencies?: IDep;
  [key: string]: any;
}

/**
 * 服务端配置
 * TODO: 支持与 devServer 共享配置
 */
export declare interface ServerConfig extends WebpackDevServer.Configuration {
  host: string;
  port: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type BabelOptionItem = string | [string, Record<string, any>?];

type EventName = 'onStart' | 'onClose' | 'onError';

// babel 配置
export interface BabelOptions {
  presets?: BabelOptionItem[];
  plugins?: BabelOptionItem[];
}

type PostCSSOptions = {
  // eslint-disable-next-line
  plugins?: any;
};

/**
 * webpack 配置
 */
export declare interface WebpackConfig {
  alias: {
    [name: string]: string;
  };
  entry: string | string[] | Record<string, string>;
  outputPath: string;
  publicPath: string;
  sourceMap: boolean;
  devtool: Config.DevTool;
  define: CommonObject<string | boolean>;
  babel: BabelOptions;
  html: CommonObject<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  less?: {
    lessOptions?: Object | Function;
    additionalData?: string | Function;
    sourceMap?: boolean;
    webpackImporter?: boolean;
    implementation?: Object | String;
    lessLogAsWarnOrErr?: boolean;
  };
  sass?: CommonObject<any>;
  postcss: PostCSSOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  terser: CommonObject<any>;
  // eslint-disable-next-line no-unused-vars
  // copy-webpack-plugin 插件的参数
  copyWebpackPlugin?: PluginOptions;
  chain?: (config: Config) => void;
}




/**
 * 最终的配置对象
 * 已包含默认配置，所以没有可选属性
 */
export declare interface ProjectOptions {
  server: ServerConfig;
  webpack: WebpackConfig;
  // 是否开启自动登录
  autoLogin?: boolean;
  events: {
    // eslint-disable-next-line
    [eventName in EventName]?: (arg?: any) => void;
  };
  // 自定义属性，给插件用
  // eslint-disable-next-line
  [key: string]: any;
}
/**
 * 用户的项目配置
 */
export type UserOptions = Partial<ProjectOptions>;

export interface ICommandPlugin {
  id: string;
  alias?: string;
  description?: string;
  fn: (api: PluginAPI, options: ProjectOptions) => void;
}

// 插件接口
export interface Plugin {
  name: string;
  version?: string;
  apply: (compiler: any, options?: any) => void;
  [key: string]: any;
}

// 插件配置
export interface PluginConfig {
  name: string;
  options?: Record<string, any>;
  enabled?: boolean;
}

// 代理配置
export interface ProxyConfig {
  context?: string | string[];
  target: string;
  changeOrigin?: boolean;
  secure?: boolean;
  pathRewrite?: Record<string, string>;
  headers?: Record<string, string>;
}

// 开发服务器配置
export interface DevServerConfig {
  port?: number;
  host?: string;
  open?: boolean;
  hot?: boolean;
  historyApiFallback?: boolean;
  proxy?: Record<string, ProxyConfig>;
  static?: {
    directory?: string;
    publicPath?: string;
  };
  headers?: Record<string, string>;
}

// 构建配置
export interface BuildConfig {
  mode: BuildMode;
  entry: string | string[] | Record<string, string>;
  output: {
    path: string;
    filename: string;
    chunkFilename?: string;
    publicPath?: string;
    clean?: boolean;
  };
  optimization?: {
    splitChunks?: any;
    minimize?: boolean;
    minimizer?: any[];
  };
  resolve?: {
    extensions?: string[];
    alias?: Record<string, string>;
  };
  module?: {
    rules?: any[];
  };
  plugins?: PluginConfig[];
  devServer?: DevServerConfig;
}

// 脚手架配置接口
export interface PackConfig {
  name: string;
  version?: string;
  description?: string;
  entry?: string | string[] | Record<string, string>;
  output?: {
    path?: string;
    filename?: string;
    publicPath?: string;
    clean?: boolean;
  };
  mode?: BuildMode;
  env?: Environment;
  plugins?: PluginConfig[];
  devServer?: DevServerConfig;
  optimization?: {
    splitChunks?: boolean | any;
    minimize?: boolean;
    compression?: boolean;
    minimizer?: any[];
  };
  resolve?: {
    extensions?: string[];
    alias?: Record<string, string>;
  };
  module?: {
    rules?: any[];
  };
  [key: string]: any;
}

// TODO: 需要优化
// 定义 RequestHandler 类型，避免依赖 express
export type RequestHandler = (req: any, res: any, next: any) => void;

/**
 * 接口代理中间件响应拦截器类型
 */
export type Interceptor = WebpackDevServer.HttpProxyMiddlewareOptions['onProxyRes'];

// 命令行选项
export interface CliOptions {
  mode?: BuildMode;
  env?: Environment;
  config?: string;
  port?: number;
  host?: string;
  open?: boolean;
  watch?: boolean;
  analyze?: boolean;
  clean?: boolean;
  [key: string]: any;
}

// 构建上下文
export interface BuildContext {
  config: PackConfig;
  options: CliOptions;
  cwd: string;
  env: Environment;
  mode: BuildMode;
}

// 插件上下文
export interface PluginContext {
  config: PackConfig;
  context: BuildContext;
  addPlugin: (plugin: PluginConfig) => void;
  addRule: (rule: any) => void;
  addAlias: (alias: Record<string, string>) => void;
  modifyConfig: (modifier: (config: PackConfig) => PackConfig) => void;
} 