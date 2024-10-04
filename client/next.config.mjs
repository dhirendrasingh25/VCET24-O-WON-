/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["lh3.googleusercontent.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
