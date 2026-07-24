/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            'framer-motion',
            'recharts',
            '@reduxjs/toolkit',
        ],
    },
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
