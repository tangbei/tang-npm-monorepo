import * as path from 'path';
import * as webpack from 'webpack';
import * as WebpackChainConfig from 'webpack-chain';
import { Service } from '../services';
import { ICommand, IPackage, Interceptor, ProjectOptions, RequestHandler } from '../types';
import { logger } from '../utils/logger';

/**
 * 插件 API
 */
export class PluginAPI {
  id: string;
  service: Service;

  constructor(id: string, service: Service) {
    this.id = id;
    this.service = service;
  }

  /**
   * current working directory
   */
  get cwd(): string {
    return this.service.context;
  }

  /**
   * 应用 package.json
   */
  get pkg(): IPackage {
    return this.service.pkg;
  }

  /**
   * 项目配置
   */
  get config(): ProjectOptions {
    return this.service.projectOptions;
  }

  /**
   * 对应 process.env.NODE_ENV
   */
  get env(): string {
    return process.env['NODE_ENV'] || 'development';
  }

  /**
   * 应用所处的 stage
   * dev | test | pre | prod
   */
  get stage(): string {
    return process.env['DEPLOY_ENV'] || 'dev';
  }

  /**
   * webpack chain 实例
   */
  chainWebpack(fn: (webpackChainConfig: WebpackChainConfig) => void): void {
    this.service.webpackChainFns.push(fn);
  }

  /**
   * 获取项目内相对路径的真实路径
   */
  resolve(_path: string): string {
    return path.resolve(this.service.context, _path);
  }

  /**
   * 获取 webpack 配置对象
   */
  resolveWebpackConfig(): webpack.Configuration {
    return this.service.resolveWebpackConfig();
  }

  /**
   * 获取 webpack 编译器实例
   */
  resolveWebpackCompile(): webpack.Compiler {
    return this.service.resolveWebpackCompile();
  }

  /**
   * 检查插件是否存在
   */
  hasPlugin(id: string): boolean {
    return this.service.commandPlugins.some((p) => p.id === id);
  }

  /**
   * 动态注册命令
   */
  registerCommand(command: ICommand): void {
    const { name, alias } = command;

    if (this.service.commands[name]) {
      logger.error(`注册 "${name}" 命令失败，该命令已存在`);
    }

    this.service.commands[name] = command;

    if (alias) {
      this.service.commands[alias] = command;
    }
  }

  /**
   * 注册响应体处理方法
   * @param cb
   */
  addResponseHandler(cb: Interceptor) {
    this.service.serverResponseHandlers.push(cb);
  }

  /**
   * 注册请求体处理方法
   * @param cb
   */
  addRequestHandler(cb: RequestHandler) {
    this.service.serverRequestHandlers.push(cb);
  }
}
