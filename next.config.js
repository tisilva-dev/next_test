/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir o domínio personalizado
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  // Configuração para melhorar a performance
  reactStrictMode: true,
  swcMinify: true,
  // Configuração para otimização de imagens
  images: {
    domains: ['lembrete.local'],
  },
  // Configuração para melhorar o SEO
  poweredByHeader: false,
  // Configuração para melhorar a segurança
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
