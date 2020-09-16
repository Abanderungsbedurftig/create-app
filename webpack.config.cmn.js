const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const PATH_DIST = path.resolve(__dirname, 'dist')
const PATH_SRC = path.resolve(__dirname, 'src')

module.exports = {
  target: 'web',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: PATH_DIST,
    filename: 'bundle.[hash].min.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
    modules: [].concat(PATH_SRC, 'node_modules'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          fallback: 'file-loader',
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PATH_SRC, 'index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[hash].css',
      chunkFilename: '[id].css',
    }),
  ]
}
