/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  crossOrigin: 'anonymous',
 
};

module.exports = {
 
  nextConfig,
  entry: './web.js',
  output: {
    filename: 'compiled.js',
  },
  resolve: {
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    fallback: {
      fs: require.resolve('fs'),
    },
  },
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
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return newConfig;
  },
  images: {
    domains: [
      'images.unsplash.com',
      '211.219.225.118',
      'https://freshour.cafe24.com',
      'shop-phinf.pstatic.net',
    ],
  },
  async rewrites () {
    // console.log('Delopy Type is Dev ?',process.env.NODE_ENV !== "production");
    console.log('Default API URL (DEV): ', process.env.NEXT_PUBLIC_API_URL_DEV);
    console.log('Default API URL (PROD): ', process.env.NEXT_PUBLIC_API_URL_PRODUCT);
    console.log('Deploy Type is Production ? ', process.env.NODE_ENV === 'production');
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/recipes',
          destination: '/shop'
        },
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
