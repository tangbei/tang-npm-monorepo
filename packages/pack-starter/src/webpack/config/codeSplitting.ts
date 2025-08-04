/** 默认分包策略 */

import * as crypto from 'crypto';
import * as webpack from 'webpack'

import { IBaseOpts } from '../types/index.js';

export function addCodeSplitting(opts: IBaseOpts) {
  const { config } = opts;
  /** 框架相关的包打成一个chunk */
  const FRAMEWORK = [
    'react-dom',
    'react',
    'react-router',
    'react-router-dom',
  ];
  config.optimization.splitChunks({
    cacheGroups: {
      default: false,
      defaultVendors: false,
      framework: {
        name: 'framework',
        chunks: 'all',
        test: new RegExp(
          `[\\\\/]node_modules[\\\\/](${FRAMEWORK.join(
            `|`,
          )})[\\\\/]`,
        ),
        priority: 40,
        enforce: true,
      },
      lib: {
        test(module: webpack.Module) {
          return (
            !isModuleCSS(module) &&
            module.size() > 160000 &&
            /node_modules[/\\]/.test(module.identifier())
          );
        },
        name(module: webpack.Module & { rawRequest: string }) {
          const rawRequest =
            module.rawRequest &&
            module.rawRequest.replace(/^@(\w+)[/\\]/, '$1-');
          if (rawRequest) {
            return `${
              rawRequest.replace(/\./g, '_').replace(/\//g, '-')
            }-lib`;
          }

          const identifier = module.identifier();
          const trimmedIdentifier = /(?:^|[/\\])node_modules[/\\](.*)/.exec(
            identifier,
          );
          const processedIdentifier =
            trimmedIdentifier &&
            trimmedIdentifier[1].replace(/^@(\w+)[/\\]/, '$1-');

          return `${processedIdentifier || identifier}-lib`;
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
        chunks: 'all',
      },
      shared: {
        name(_module: webpack.Module, chunks: Array<webpack.Chunk>) {
          const cryptoName = crypto
            .createHash('sha1')
            .update(
              chunks.reduce((acc: any, chunk: any) => {
                return acc + chunk.name;
              }, ''),
            )
            .digest('base64')
            // replace `+=/` that may be escaped in the url
            // https://github.com/umijs/umi/issues/9845
            .replace(/\//g, '')
            .replace(/\+/g, '-')
            .replace(/=/g, '_');
          return `shared-${cryptoName}`;
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
        chunks: 'async',
      },
    },
  });
}

function isModuleCSS(module: { type: string }) {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  );
}
