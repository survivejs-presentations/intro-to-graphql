const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CLIENT_PATH = path.join(__dirname, "client");

module.exports = env => ({
  stats: "minimal",
  module: {
    rules: [
      {
        test: /\.js(x)$/,
        use: [
          "babel-loader",
          {
            loader: "linaria/loader",
            options: {
              sourceMap: env === "develop"
            }
          }
        ],
        include: CLIENT_PATH
      },
      {
        test: /\.css$/,
        use: [
          env === "develop" ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: env === "develop"
            }
          }
        ]
      },
      {
        test: /\.woff(2)?|\.ttf$|\.eot$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 5000
            }
          }
        ]
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        use: "file-loader"
      },
      {
        test: /\.(md|txt)$/,
        use: "raw-loader"
      },
      {
        test: /\.graphql$/,
        use: "graphql-tag/loader"
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
});
