import deepmerge from 'deepmerge';
import { existsSync } from 'fs';
import path from 'path';
import { ProjectOptions, UserOptions } from '../types';
import { logger } from '../utils/logger';
import { resolveAppPath } from '../utils/path';
import { getDefaultConfig } from './default';

type NodeEnv = 'development' | 'production';

const configLocations = {
  base: ['.packrc.js'],
  development: ['config/dev.js'],
  production: ['config/prod.js'],
};

/**
 * 从 paths 队列中加载配置文件，一旦有配置内容即返回
 */
const loadConfigByPaths = (paths: string[], required = false): UserOptions => {
  // const logger = new Logger('EWT:Core:Config');
  let readPath: string | null = null;

  paths.some((filePath) => {

    // 传进来的 path 是相对根目录的地址
    const realFilePath = resolveAppPath(filePath);

    // 只要有文件存在，就读取这个文件，如果读取出错，就直接抛出
    const isExist = existsSync(realFilePath);

    if (isExist) {
      readPath = realFilePath;
    }

    return isExist;
  });

  if (!readPath) {
    // 如果是必须的配置，就抛错并退出进程
    if (required) {
      logger.error('❌ 未找到配置文件！请确认已正确配置');

      process.exit(1);
    } else {
      return {};
    }
  }

  const relativePath = path.relative(process.cwd(), readPath);

  logger.info(`正在从 ${relativePath} 加载配置`);

  return require(readPath);
};

/**
 * 获取项目配置
 * @returns 项目配置
 */
export const getProjectOptions = (): ProjectOptions => {
  const nodeEnv: NodeEnv = (process.env['NODE_ENV'] || 'development') as NodeEnv;

  // 提供根据环境区分配置文件的配置
  const envSpecificConfig = loadConfigByPaths([...configLocations[nodeEnv]]);
  // 根目录的基础配置
  const baseConfig = loadConfigByPaths([...configLocations.base], true);
  // console.log('baseConfig', baseConfig);
  const options = deepmerge.all([
    getDefaultConfig(),
    baseConfig,
    envSpecificConfig,
  ]) as ProjectOptions;

  // 因为 OSS 默认配置依赖 webpack 配置，放最后再处理一遍
  return options;
};