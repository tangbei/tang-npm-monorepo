const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack配置文件
 * 支持JavaScript、React、热重载等功能
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    // 入口文件
    entry: './src/index.jsx',
    
    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true, // 构建前清理dist目录
      publicPath: '/'
    },
    
    // 解析配置
    resolve: {
      extensions: ['.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    },
    
    // 模块配置
    module: {
      rules: [
        // JavaScript/JSX处理
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions']
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }]
              ]
            }
          },
          exclude: /node_modules/
        },
        
        // CSS处理
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        
        // SCSS处理
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        
        // 图片处理
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        
        // 字体处理
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        }
      ]
    },
    
    // 插件配置
    plugins: [
      // HTML模板插件
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: true,
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      })
    ],
    
    // 开发服务器配置
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true, // 支持React Router
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    
    // 开发工具配置
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    
    // 优化配置
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    
    // 性能提示
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
}; 