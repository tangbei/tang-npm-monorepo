import * as ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import webpack from 'webpack';
import { resolveAppPath } from '../../utils/path';
import type { IBaseOpts } from '../types';
import { addAssetRules } from './assetRules';
import { addCodeSplitting } from './codeSplitting';
import { addCSSRules } from './cssRules';
import { addBabelJsRules } from './jsRulesWithBabel';

export function addBaseRules(opts: IBaseOpts) {
  const cwd = process.cwd();
  const { config, isProd, userWebpackConfig } = opts;
  // 不支持的直接merge
  config.merge({ target: ['web', 'es5'] });
  // stats
  config.stats('errors-warnings');
  // mode
  config.mode(isProd ? 'production' : 'development');
  // devtool
  config.devtool(isProd ? false : (userWebpackConfig?.devtool || 'cheap-module-source-map'));
  // output
  addOutput({ ...opts, cwd });
  // optimization
  addOptimization(opts);
  // 默认分包策略
  addCodeSplitting(opts);
  // resolve
  addResolve(opts);
  // plugins
  addPlugins(opts);
  // asset
  addAssetRules(opts);
  // css
  addCSSRules(opts);
  // js
  // addJsRules(opts);
  addBabelJsRules(opts);
}

/** plugins */
function addPlugins(opts: IBaseOpts) {
  const { config, isProd, userWebpackConfig, showProgress } = opts;
  const hash = isProd ? '.[contenthash:8]' : '';
  // 把css单独抽离出去
  config.plugin('mini-css-extract-plugin')
  .use(require.resolve('mini-css-extract-plugin'), [{
    filename: `css/[name]${hash}.css`,
    chunkFilename: `css/[name]${hash}.async.css`,
    ignoreOrder: true,
  }]);

  console.log('showProgress--->', showProgress);
  // 进度条展示
  if (showProgress) {
    const WebpackBar = require('webpackbar');
    config.plugin('webpackbar-plugin').use(WebpackBar, [{
      name: 'pack-starter',
      color: '#3f51b5',
      profile: true
    }]);
  }
  // 定义全局变量
  if (userWebpackConfig?.define && Object.keys(userWebpackConfig?.define).length) {
    config.plugin('define-plugin').use(webpack.DefinePlugin, [userWebpackConfig?.define])
  }
  // html模板
  if (userWebpackConfig?.html && Object.keys(userWebpackConfig?.html).length) {
    config.plugin('html-webpack-plugin').use(require.resolve('html-webpack-plugin'), [userWebpackConfig?.html]);
  }
  // 复制插件
  if (userWebpackConfig?.copyWebpackPlugin && Object.keys(userWebpackConfig?.copyWebpackPlugin).length) {
    config.plugin('copy-webpack-plugin').use(require.resolve('copy-webpack-plugin'), [userWebpackConfig?.copyWebpackPlugin]);
  }
}

/** resolve */
function addResolve(opts: IBaseOpts) {
  const { config } = opts;
  config.resolve.extensions.merge([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".wasm",]);
}

/** optimization */
function addOptimization(opts: IBaseOpts) {
  const { config, isProd, userWebpackConfig } = opts;
  // js压缩
  config.optimization.minimize(isProd).minimizer('js-minimizer')
  .use(require.resolve('terser-webpack-plugin'), [{ terserOptions: {
    compress: {
      passes: 2,
    }
  }, ...(userWebpackConfig?.terser || {}) }]);
  // css压缩
  config.optimization.minimizer('css-minimizer').use(require.resolve('css-minimizer-webpack-plugin'), [{
    minimizerOptions: {
      preset: ['default', {
        // 默认不进行属性合并
        mergeLonghand: false,
        // 默认不进行 font-weight 值的转换
        minifyFontValues: false,
      }],
    }
  }]);
  // svg压缩
  config.optimization.minimizer('svg-minimizer')
  .use(ImageMinimizerPlugin.default,
    [{
      minimizer: {
        implementation: ImageMinimizerPlugin.svgoMinify,
        options: {
          encodeOptions: {
            multipass: true,
            plugins: [
              "preset-default",
            ],
          }
        }
      }
    }]
  )
}

/** output */
interface IAddOutput  extends IBaseOpts {
  cwd: string;
}
function addOutput(opts: IAddOutput) {
  const { config, isProd, userWebpackConfig } = opts;
  // 优先用项目自定义的配置
  config.output.path(resolveAppPath(userWebpackConfig?.outputPath || './dist'))
  .filename(isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js')
  .chunkFilename(isProd
    ? "js/[name].[contenthash:8].async.js"
    : "js/[name].async.js")
  .publicPath(userWebpackConfig?.publicPath || '/')
  .merge({
    clean: true,
    assetModuleFilename: 'media/[name].[hash][ext]',
  });
}
