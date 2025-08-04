import deepmerge from 'deepmerge';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as Config from 'webpack-chain';

import { IBaseOpts } from '../types/index.js';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module(s)?\.css$/;
const sassRegex = /\.(scss|sass)$/;
const lessRegex = /\.less$/;

interface IAddCSSRules extends IBaseOpts {
}

export function addCSSRules(opts: IAddCSSRules) {
  const { config, isProd, userWebpackConfig } = opts;
  const rule = config.module.rule('style');
  /** .css */
  addStyleLoaders({
    userWebpackConfig,
    rule: rule.oneOf('css').test(cssRegex).merge({ sideEffects: true, exclude: cssModuleRegex }) as unknown as Config.Rule,
    cssOptions: {
      importLoaders: 1,
  }, isProd });
  /** .module.css */
  addStyleLoaders({
    userWebpackConfig,
    rule: rule.oneOf('module-css').test(cssModuleRegex) as unknown as Config.Rule,
    cssOptions: {
      importLoaders: 1,
      modules: {
        mode: 'local',
        exportLocalsConvention: 'camelCase',
        localIdentName: "[path][name]__[local]--[hash:base64:5]",
      },
  }, isProd });
  const commonCssOptions = {
    importLoaders: 2,
    modules: {
      auto: true,
      mode: 'local',
      // 支持模块化导出
      exportLocalsConvention: 'camelCase',
      localIdentName: "[path][name]__[local]--[hash:base64:5]",
    },
  }
  /** (.module).scss|(.module).sass */
  addStyleLoaders({
    userWebpackConfig,
    rule: rule.oneOf('scss').test(sassRegex).merge({ sideEffects: true }) as unknown as Config.Rule,
    isSass: true,
    cssOptions: commonCssOptions, isProd });
  /** less */
  addStyleLoaders({
    userWebpackConfig,
    rule: rule.oneOf('less').test(lessRegex).merge({ sideEffects: true }) as unknown as Config.Rule,
    isLess: true,
    cssOptions: commonCssOptions, isProd });
}

interface IAddStyleLoaders {
  rule: Config.Rule;
  cssOptions?: Record<string, unknown>;
  isSass?: boolean;
  isLess?: boolean;
  isProd: boolean;
  userWebpackConfig: IBaseOpts['userWebpackConfig'];
}

function addStyleLoaders(opts: IAddStyleLoaders) {
  const { rule, cssOptions = {}, isLess, isSass, userWebpackConfig } = opts;
  rule.use('miniCssExtractPlugin-loader').loader(MiniCssExtractPlugin.loader)
  rule.use('css-loader').loader(require.resolve('css-loader')).options(cssOptions);
  rule.use('postcss-loader').loader(require.resolve('postcss-loader')).options({
    postcssOptions: deepmerge.all([{
      ident: 'postcss',
      config: false,
      plugins:[
            require.resolve('postcss-preset-env'),
            require.resolve('autoprefixer'),
          ]
    }, userWebpackConfig?.postcss || {}]),
  });
  /** sass-loader */
  if (isSass) {
    // rule.use('resolve-url-loader').loader('resolve-url-loader');
    rule.use('sass-loader').loader(require.resolve('sass-loader')).options({
      ...(userWebpackConfig?.sass || {}),
      sourceMap: true,
    });
  }
  /** less-loader */
  if (isLess) {
    rule.use('less-loader').loader(require.resolve('less-loader')).options(userWebpackConfig?.less || {});
  }
}
