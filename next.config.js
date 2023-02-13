
module.exports = {
  // distDir: "build",
  crossOrigin: "anonymous",
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: false,
  env: {
    SANITY_PROJECT_ID: '',
  },
  webpack: (config) => {
    const prod = process.env.NODE_ENV === 'production';
    const newConfig = {
      ...config,
      mode: prod ? 'production' : 'development',
    };
    if (prod) {
      newConfig.devtool = 'hidden-source-map';
    }
    config.entry = './web.js';
    config.resolve.fallback = {fs: require.resolve('fs')}
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return newConfig;
  },
  images: {
    domains: [
      'localhost',
      '192.168.0.90',
      'barfdogserver.co.kr',
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  async rewrites () {
    // console.log('Delopy Type is Dev ?',process.env.NODE_ENV !== "production");
    console.log('Default API URL (DEV): ', process.env.NEXT_PUBLIC_API_URL_DEV);
    console.log('Default API URL (PROD): ', process.env.NEXT_PUBLIC_API_URL_PRODUCT);
    console.log('Deploy Type is Production ? ', process.env.NODE_ENV === 'production');
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: process.env.SOURCE_PATH,
          destination: process.env.NEXT_PUBLIC_API_URL_DEV
        },
      ];
    } else if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: process.env.SOURCE_PATH,
          destination: process.env.NEXT_PUBLIC_API_URL_PRODUCT
        }
      ];
    }
  }
};
