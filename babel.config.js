module.exports = {
  env: {
    development: {
      // plugins: ['transform-remove-console'], // 주석제거 plugin
    },
    production: {
      plugins: ['transform-remove-console'], // 주석 & console.log 제거
    },
  },
};
