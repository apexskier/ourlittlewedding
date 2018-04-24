const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "main.css",
            },
          },
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
