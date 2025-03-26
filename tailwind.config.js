/**
 * Configuração do Tailwind CSS
 * 
 * Este arquivo define as configurações do Tailwind CSS,
 * incluindo:
 * - Conteúdo a ser processado
 * - Tema personalizado
 * - Plugins
 * - Modo escuro
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * Define quais arquivos devem ser processados pelo Tailwind
   * 
   * Inclui:
   * - Arquivos de páginas
   * - Arquivos de componentes
   * - Arquivos de estilos
   * - Arquivos Markdown
   */
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  /**
   * Configuração do modo escuro
   * 
   * 'media': Usa a preferência do sistema operacional
   * 'class': Usa uma classe CSS para controlar o modo
   */
  darkMode: 'media',

  /**
   * Configuração do tema
   * 
   * Define:
   * - Cores personalizadas
   * - Animações
   * - Keyframes
   * - Outras extensões do tema
   */
  theme: {
    extend: {
      /**
       * Cores personalizadas
       * 
       * Usa variáveis CSS para permitir:
       * - Mudança dinâmica de cores
       * - Suporte a transparência
       * - Consistência em toda a aplicação
       */
      colors: {
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-color) / <alpha-value>)',
        success: 'rgb(var(--success-color) / <alpha-value>)',
        warning: 'rgb(var(--warning-color) / <alpha-value>)',
        danger: 'rgb(var(--danger-color) / <alpha-value>)',
        gray: {
          50: 'rgb(var(--gray-50) / <alpha-value>)',
          100: 'rgb(var(--gray-100) / <alpha-value>)',
          200: 'rgb(var(--gray-200) / <alpha-value>)',
          300: 'rgb(var(--gray-300) / <alpha-value>)',
          400: 'rgb(var(--gray-400) / <alpha-value>)',
          500: 'rgb(var(--gray-500) / <alpha-value>)',
          600: 'rgb(var(--gray-600) / <alpha-value>)',
          700: 'rgb(var(--gray-700) / <alpha-value>)',
          800: 'rgb(var(--gray-800) / <alpha-value>)',
          900: 'rgb(var(--gray-900) / <alpha-value>)',
        },
      },

      /**
       * Animações personalizadas
       * 
       * Define animações reutilizáveis
       * para melhor experiência do usuário
       */
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },

      /**
       * Keyframes para animações
       * 
       * Define os pontos de início e fim
       * das animações personalizadas
       */
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  /**
   * Plugins do Tailwind
   * 
   * Adiciona funcionalidades extras
   * ao framework
   */
  plugins: [],
}