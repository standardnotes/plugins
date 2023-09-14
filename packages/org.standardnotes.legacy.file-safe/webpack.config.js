const webpack = require("webpack")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: {
    "dist.js": path.resolve(__dirname, "app/main.js"),
    "dist.min.js": path.resolve(__dirname, "app/main.js"),
    "main.css": path.resolve(__dirname, "app/stylesheets/main.scss"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "./[name]",
  },
  mode: "production",
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", // The base assets directory in relation to the stylesheets
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js[x]?$/,
        include: [path.resolve(__dirname, "app")],
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"],
    alias: {
      filesafe_embed: path.join(
        __dirname,
        "node_modules/filesafe-embed/dist/dist.css"
      ),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "dist.css",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./app/index.html", to: "index.html" },
        { from: "./app/index.min.html", to: "index.min.html" },
        {
          from: "./node_modules/filesafe-js/dist/filesafe-js/EncryptionWorker.js",
          to: "filesafe-js/EncryptionWorker.js",
        },
      ],
    }),
  ],
}
