const path = require("path");
const webpack = require("webpack");

const indexCondition = {
  test: /(normalize|index)\.\w+$/,
};

module.exports = {
  entry: {
    "wedding-party": "./src/wedding-party",
    coolquiz: "./src/coolquiz",
    index: "./src/index",
    logistics: "./src/logistics",
    registry: "./src/registry",
    photos: "./src/photos",
    us: "./src/us",
    "404": "./src/404",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/[hash].[ext]",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
          { loader: "extract-loader" },
          {
            loader: "html-loader",
            options: {
              minimize: true,
              attrs: ["img:src", "link:href"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "file-loader", options: { name: "assets/[hash].[ext]" } },
          { loader: "extract-loader" },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
  externals: {
    three: "THREE",
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
  ],
};
