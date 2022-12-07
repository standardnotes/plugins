const path = require("path")
const { merge } = require("webpack-merge")
const config = require("./webpack.config.js")

module.exports = merge(config, {
  mode: "development",
  devtool: "cheap-source-map",
  devServer: {
    port: 8001,
    hot: true,
    static: "./dist",
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
})
