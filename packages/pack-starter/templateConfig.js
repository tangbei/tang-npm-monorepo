/**
 * @ewt/cli 模板配置文件 - 请根据项目实际情况进行增添和修改
 * 接入文档地址：https://ewturteam.yuque.com/na6v51/qr677w/hb3gx98gkc9ofbuo
 */

const path = require('path');

/**
 * @type {import('@ewt/cli').ProjectOptions}
 */
module.exports = {
  // webpack 配置，支持的快捷配置项完整版请参考接入文档
  webpack: {
    // 编译入口
    entry: './src/index.ts',
    // 静态资源公共路径
    publicPath: process.env.ASSET_PATH || '/',
    // html 模板地址
    html: {
      template: './src/index.html'
    },
    // 别名
    alias: {
      '~': './src',
    },
    // 对于不支持快捷配置的 webpack 配置项可以通过 chain 函数进行配置或更改
    chain: config => {
      /**
       * cli 内部默认 include src 下的内容同时会 exclude node_modules
       * 想要把三方包进行 babel 编译的，可以按下列方式进行修改
       * 比如把 axios 过 babel
       */
      config.module.rule('js').oneOf('js')
        .exclude.clear().end()
        .include
          .add(path.join(__dirname, 'src'))
          .add(/node_modules[\\/](axios)/)
        .end();
    }
  },
  // 开发服务器的配置，和 webpack-dev-server 配置项一致
  server: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy: [],
    host: 'localhost',
    port: 3001,
    open: true,
    server: 'https',
  }
};
