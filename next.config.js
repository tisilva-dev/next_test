/**
 * Configuração do Next.js
 * 
 * Este arquivo define as configurações globais da aplicação Next.js
 * incluindo otimizações de performance, segurança e SEO.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Configuração de rewrites para manipulação de rotas
   * 
   * Permite redirecionar requisições de uma rota para outra
   * Útil para:
   * - Simplificar URLs
   * - Esconder implementação interna
   * - Manter compatibilidade com rotas antigas
   */
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },

  /**
   * Configurações de performance
   * 
   * reactStrictMode: Ativa o modo estrito do React para melhor
   * detecção de problemas potenciais
   * 
   * swcMinify: Usa o minificador SWC para melhor performance
   * na compilação
   */
  reactStrictMode: true,
  swcMinify: true,

  /**
   * Configuração de imagens
   * 
   * Define como o Next.js deve lidar com imagens:
   * - domains: Lista de domínios permitidos para imagens externas
   * - dangerouslyAllowSVG: Permite o uso de imagens SVG
   * - contentDispositionType: Define como as imagens devem ser servidas
   */
  images: {
    domains: ['lembrete.local'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  /**
   * Configuração de SEO
   * 
   * Remove o cabeçalho "X-Powered-By: Next.js"
   * para melhor segurança e personalização
   */
  poweredByHeader: false,

  /**
   * Configuração de segurança
   * 
   * Define cabeçalhos HTTP de segurança:
   * - X-DNS-Prefetch-Control: Otimiza resolução de DNS
   * - Strict-Transport-Security: Força HTTPS
   * - X-Frame-Options: Previne clickjacking
   * - X-Content-Type-Options: Previne MIME-sniffing
   * - Referrer-Policy: Controla informações de referência
   */
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
