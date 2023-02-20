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
  }
}
