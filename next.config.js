
const dev = process.env.NODE_ENV === 'development';

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
      'www.barfdogserver.com',
      'dev.barfdogserver.com',
      'img.lifet.co.kr'
    ],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.barfdogserver.com',
        // port: '8581',
        // pathname: '/*',
      },
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
    console.log('Default API URL (DEV): ', process.env.NEXT_PUBLIC_API_URL_DEV);
    console.log('Default API URL (PROD): ', process.env.NEXT_PUBLIC_API_URL_PRODUCT);
    
    return [
    {
      source: '/api/:path*',
      destination: dev
        ? process.env.NEXT_PUBLIC_API_URL_DEV + '/api/:path*'
        : process.env.NEXT_PUBLIC_API_URL_PRODUCT + '/api/:path*',
    },
  ];
  },
  async redirects(){
    return [
      {
        source: '/kr/(.*)',
        destination: '/',
        permanent: true
      }
    ]
  }
};
