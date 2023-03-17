const isTransformer =
  require("typescript-is/lib/transform-inline/transformer").default;

const baseConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};

// const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
module.exports = (phase, { defaultConfig }) => {
  const config = {
    swcMinify: true,
    webpack: (config, _) => {
      config.module.rules.push({
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          // make sure not to set `transpileOnly: true` here, otherwise it will not work
          getCustomTransformers: (program) => ({
            before: [isTransformer(program)],
          }),
        },
      });

      return config;
    },
  };

  return Object.assign(config, baseConfig);
};
