const webpack = require('webpack');

function makeBanner(name) {
  const lines = [
    "==UserScript==",
    `@name     ${name}`,
    "@version  1",
    "@grant    none",
    "@include https://*.wikipedia.org/wiki/*",
    "==/UserScript=="
  ];
  return lines.map(line => `// ${line}`).join("\n");
}

module.exports = {
  entry: {
    language: "./dist/wikipedia/language.js"
  },
  output: {
    path: __dirname + '/bundle',
    filename: "[name].js"
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: makeBanner("Wikipedia: Add keyboard shortcuts to select inter-language links"),
      raw: true
    })
  ]
}
