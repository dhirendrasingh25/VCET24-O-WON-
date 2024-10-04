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
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "http://localhost:4001/:path*",
            },
        ];
    },
};

export default nextConfig;
