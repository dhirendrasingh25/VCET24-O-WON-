// import NextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "static2.finnhub.io",
            },
            {
                protocol: "https",
                hostname: "image.cnbcfm.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

// const withPWA = NextPWA({
//     dest: "public",
// });

export default nextConfig;
