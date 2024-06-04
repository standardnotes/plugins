const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  mode: 'production',
  entry: {
    main: 'index.tsx'
  },
  output: {
    filename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ],
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    https: false,
    port: 8085,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.IS_PREACT": JSON.stringify("false")
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["main"]
    })
  ],
});
