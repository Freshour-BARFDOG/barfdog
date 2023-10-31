module.exports = {
  env: {
    development: {
      // plugins: ['transform-remove-console'], // 주석제거 plugin
    },
    production: {
      plugins: ['transform-remove-console'], // Plugin function: 주석 및 // console.log 제거
    },
  },
};
