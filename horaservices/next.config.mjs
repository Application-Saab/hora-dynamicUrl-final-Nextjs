/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next resizes and serves WebP from /_next/image (we run `next start`).
    // SVG and data: URLs are passed through untouched by next/image.
    // WebP only: AVIF is ~20% smaller but far slower to encode on first request.
    formats: ["image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Product, photographer and review images come from the API and several
    // external hosts (S3 buckets, Play Store avatars, ...). Allowing any HTTPS
    // host means no image can break; narrow this to the real hosts once known.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  compiler: {
    styledComponents: true,
  },
  // output: "export",
  // trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/videos/",
          outputPath: "static/videos/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
