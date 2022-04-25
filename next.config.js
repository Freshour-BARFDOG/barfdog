/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

};


module.exports = {
  nextConfig,
  entry: "./web.js",
  output: {
    filename: "compiled.js",
  },
  resolve: {
    extensions: ["js", "jsx", "ts", "tsx"],
    fallback: {
      fs: require.resolve("fs"),
    },
  },
  trailingSlash: false,
  env: {
    SANITY_PROJECT_ID: "",
  },
  webpack: (config) => {
    const prod = process.env.NODE_ENV === "production";
    const newConfig = {
      ...config,
      mode: prod ? "production" : "development",
    };
    // if (prod) {
    //   newConfig.devtool = "hidden-source-map";
    // }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return newConfig;
  },
  images: {
    domains: [
      "images.unsplash.com",
      "211.219.225.118",
      "shop-phinf.pstatic.net",
    ],
  },
  async rewrites() {
        if (process.env.NODE_ENV !== "production") {
          return [
            {
              destination: process.env.DESTINATION_URL,
              source: process.env.SOURCE_PATH,
            },
          ];
        }
  },
};