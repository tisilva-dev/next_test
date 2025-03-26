/**
 * Configuração do PostCSS
 * 
 * PostCSS é uma ferramenta para transformar CSS com plugins JavaScript.
 * Neste projeto, é usado principalmente para:
 * - Processar o Tailwind CSS
 * - Adicionar prefixos de vendor automaticamente
 * - Otimizar o CSS final
 */

module.exports = {
    plugins: {
        /**
         * Plugin do Tailwind CSS
         * 
         * Processa as diretivas do Tailwind e
         * gera o CSS final com apenas as classes utilizadas
         */
        'tailwindcss': {},
        
        /**
         * Plugin Autoprefixer
         * 
         * Adiciona automaticamente prefixos de vendor
         * para melhor compatibilidade entre navegadores
         */
        'autoprefixer': {},
    },
} 