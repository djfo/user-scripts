const webpack = require("webpack");
const fs = require("fs/promises");

function makeBanner({ name, version, grant, include }) {
  const lines = [].concat(
    ["==UserScript==", `@name ${name}`, `@version ${version}`],
    grant.map((g) => `@grant ${g}`),
    include.map((i) => `@include ${i}`),
    ["==/UserScript=="]
  );
  return lines.map((line) => `// ${line}`).join("\n");
}

module.exports = async (env) => {
  const raw = await fs.readFile(`./bundle/${env.target}.meta.json`, "utf8");
  const meta = JSON.parse(raw);

  const entry = {
    [env.target]: `./dist/${meta.entry}`,
  };

  return {
    entry,
    output: {
      path: __dirname + "/bundle",
      filename: "[name].js",
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: makeBanner(meta.userScript),
        raw: true,
      }),
    ],
    mode: "production"
  };
};
