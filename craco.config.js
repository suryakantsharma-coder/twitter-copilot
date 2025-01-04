module.exports = {
    webpack: {
      configure: (config) => {
        config.optimization.splitChunks = {
          cacheGroups: {
            default: false,
          },
        };
        config.output.filename = "static/js/[name].js";
        return config;
      },
    },
  };
  