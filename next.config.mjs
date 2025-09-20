import createNextIntlPlugin from 'next-intl/plugin'

// Use the same i18n plugin setup as next.config.ts so next-intl can find its config
const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['res.cloudinary.com'] },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] } },
  
  // تجاهل أخطاء الأنواع في TypeScript
  typescript: {
    // !! تحذير !! يسمح بإنهاء البناء مع وجود أخطاء أنواع
    ignoreBuildErrors: true,
  },

  // تجاهل أخطاء ESLint أثناء البناء
  eslint: {
    // !! تحذير !! يسمح بإنهاء البناء مع وجود أخطاء لنت
    ignoreDuringBuilds: true,
},
};

export default withNextIntl(nextConfig)
