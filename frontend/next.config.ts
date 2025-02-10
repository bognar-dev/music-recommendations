
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'p.scdn.co',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
