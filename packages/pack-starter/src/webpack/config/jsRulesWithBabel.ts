
import { IBaseOpts } from '../types/index.js';

export function addBabelJsRules(opts: IBaseOpts) {
  const { config, userWebpackConfig } = opts;
  config.module.rule('js').oneOf('js')
  .test(/\.(js|mjs|jsx|ts|tsx|cjs)$/)
  .merge({ exclude: /node_modules/ })
  .use('babel-loader')
  .loader(require.resolve('babel-loader'))
  .options({
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          corejs: '3.37',
        }
      ],
      [require.resolve('@babel/preset-typescript'), {
        isTSX: true,
        allExtensions: true,
      }],
      [require.resolve('@babel/preset-react')],
      ...(userWebpackConfig?.babel?.presets || []),
    ],
    plugins: [require.resolve('@babel/plugin-transform-runtime'), ...(userWebpackConfig?.babel?.plugins || [])]
  })
}
