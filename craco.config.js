module.exports = {
  webpack: {
    configure: (config) => {
      // config.optimization.splitChunks = {
      //   cacheGroups: {
      //     default: false,
      //   },
      // };
      // config.output.filename = 'static/js/[name].js';

      // disable chunk splitting
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;

      // ensure predictable output (all code in main.js)
      config.output.filename = 'static/js/[name].js';
      config.output.chunkFilename = 'static/js/[name].js';
      return config;
    },
  },
};
