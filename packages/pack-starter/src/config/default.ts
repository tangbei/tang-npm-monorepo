import { existsSync } from 'node:fs';
import * as path from 'node:path';

import * as readPkg from 'read-pkg';

import type { ProjectOptions } from '../types';
import * as env from '../utils/env';
import { resolveAppPath } from '../utils/path';

export const getDefaultConfig = (): ProjectOptions => {
  // 仅开发模式下默认打开 source map
  const defaultDevTool = env.isDev() ? 'source-map' : false;

  const cwd = process.cwd();

  const pkg = readPkg.sync({ cwd });
  // 默认应用名称和版本，从 package.json 取
  const appName =  pkg.name;
  const appVersion = pkg.version;

  // 默认的一些路径
  // 客户端路径默认使用 client/ ，到生成的地方再去检查是不是要改为 src
  const paths = {
    // 默认的输出目录
    defaultOutputPath: resolveAppPath('dist'),
    // 默认的 html 模版位置
    defaultHtmlTemplate: path.resolve(__dirname, './static/template.ejs'),
    // 默认的 favicon 位置
    // defaultFavicon: path.resolve(__dirname, './static/favicon.ico'),
    // 自定义 html 模版
    customHtmlTemplate: resolveAppPath('client/pages/index.template.ejs'),
    // 自定义 favicon
    customFavicon: resolveAppPath('client/pages/favicon.ico'),
  }

  // 先查找 client 目录在不在
  // TODO: 根据应用类型判断代码根目录
  const isClientDirExist = existsSync(resolveAppPath('client'));

  // 只要 client 目录不存在就认定源代码根目录为 src/
  const sourceCodeRoot = isClientDirExist
    ? resolveAppPath('client')
    : resolveAppPath('src');

  // 默认客户端入口文件
  const defaultEntry = path.join(sourceCodeRoot, 'index');

  // 根据是否配置自定义的 html 模版和 favicon 判断是否需要使用默认的模版
  const templatePath = path.join(sourceCodeRoot, 'pages/index.template.ejs');
  // const faviconPath = path.join(sourceCodeRoot, 'pages/favicon.ico')

  /**
   * 获取默认配置
   */
  return {
    server: {
      host: '0.0.0.0',
      port: 9001,
      proxy: {},
    },
    webpack: {
      alias: {
        '@': sourceCodeRoot,
      },
      entry: defaultEntry,
      outputPath: paths.defaultOutputPath,
      publicPath: '/',
      devtool: defaultDevTool,
      sourceMap: true,
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // 透传应用名称和版本，对应 package.json 中的 name / version 字段
        __APP_NAME__: JSON.stringify(appName),
        __APP_VERSION__: JSON.stringify(appVersion),
        __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
        // 透传应用阶段字段，需要在构建时注入
        __APP_STAGE__: JSON.stringify(process.env.DEPLOY_ENV),
      },
      babel: {
        presets: [],
        plugins: [],
      },
      html: {
        template: templatePath,
        //favicon: faviconPath,
      },
      less: {},
      postcss: {
        plugins: [],
      },
      terser: {},
    },
    events: {},
  };
};
