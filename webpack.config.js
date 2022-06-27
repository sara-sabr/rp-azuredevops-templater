const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const entries = {};
const srcDir = path.join(__dirname, "src");

/**
 * Allow structure as long as we find an azure-devops-extension.json file as these are the extension points with
 * typescript code.
 * - (A) It is a folder
 * - (B) The folder contains a 'azure-devops-extension.json' file
 * - A typescript file will be searched for and if found used. Not all extension points have code as some are just
 *   UI cosmetic changes.
 * - (C) The corresponding typescript file must named the same name as the folder name.
 *   - Example (valid)
 *        ReportHub/ReportHub.ts
 *        ReportHub/ReportHub.tsx
 *   - Example (Invalid)
 *        ReportHub/Hub.ts
 *        ReportHub/Hub.tsx
 * - At least one entry must be found.
 *
 * @param dir a directory name (not FQN)
 * @returns true if include, otherwise false.
 */
function findModules(dir) {
  return /** (A) **/ fs.statSync(path.join(srcDir, dir)).isDirectory()
  && /** (B) **/ fs.existsSync(path.join(srcDir, dir, 'azure-devops-extension.json'))
  && ( /** (C) **/
      fs.existsSync(path.join(srcDir, dir, dir + '.ts'))
      || fs.existsSync(path.join(srcDir, dir, dir + '.tsx'))
  );
}


fs.readdirSync(srcDir)
  .filter(findModules)
  .forEach(dir => {
    entries[dir] = "./" + path.join("src", dir, dir)
  });

console.log(entries);

module.exports = {
  target: "web",
  entry: entries,
  output: {
    filename: "[name]/[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "azure-devops-extension-sdk": path.resolve(
        "node_modules/azure-devops-extension-sdk"
      )
    }
  },
  stats: {
    warnings: false,
    entrypoints: false,
    modules: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "azure-devops-ui/buildScripts/css-variables-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: "base64-inline-loader"
          }
        ]
      },
      {
        test: /\.html$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [new CopyWebpackPlugin({
    patterns: [
      { from: "**/*.html", context: path.resolve(__dirname, "src")},
      { from: "img/**", to: "static"},
    ],
    options: {
      concurrency: 100,
    }
  })]
};
