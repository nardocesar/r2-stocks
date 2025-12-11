export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [">0.25%", "not dead", "not ie 11"],
        },
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
};
