// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// لو request.ts داخل src/app/i18n:
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

const nextConfig: NextConfig = {
  images: { domains: ['res.cloudinary.com'] },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] }
  }
};

export default withNextIntl(nextConfig);
