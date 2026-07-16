const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    async rewrites() {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://dunchesbackend.mazlis.com";
        return [
            {
                source: "/api/v1/:path*",
                destination: `${apiBase}/api/v1/:path*`,
            },
            {
                source: "/uploads/:path*",
                destination: `${apiBase}/uploads/:path*`,
            },
        ];
    },
};
export default nextConfig;
