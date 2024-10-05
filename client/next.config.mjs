/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        // domains: ["lh3.googleusercontent.com"],
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

export default nextConfig;
