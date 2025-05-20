/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'horaservices.com',
            //   hostname: 'photography-hora.s3.amazonaws.com',
              pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'play-lh.googleusercontent.com',
                pathname: '/**',
              },
          ],
          unoptimized: false,  
          loader:"default" 
    },
    // output: "export",
    // trailingSlash: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.(mp4|webm|ogg|swf|ogv)$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next/static/videos/',
                    outputPath: 'static/videos/',
                    name: '[name].[hash].[ext]',
                },
            },
        });

        return config;
    }
};

export default nextConfig;
