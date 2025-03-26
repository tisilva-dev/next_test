/**
 * Importação dos tipos necessários do Next.js
 * Metadata é usado para definir metadados da aplicação
 * como título, descrição, etc.
 */
import type { Metadata } from "next";
/**
 * Importação da fonte Inter do Google Fonts
 * Esta fonte é otimizada para web e oferece boa legibilidade
 */
import { Inter } from "next/font/google";
/**
 * Importação dos estilos globais da aplicação
 * Inclui configurações do Tailwind CSS e estilos personalizados
 */
import "./globals.css";

/**
 * Configuração da fonte Inter do Google Fonts
 * 
 * A fonte é otimizada para carregamento:
 * - É carregada apenas quando necessário
 * - É pré-carregada para melhor performance
 * - Inclui apenas os pesos necessários
 * - É otimizada para web
 * 
 * @param subsets - Define quais subconjuntos da fonte serão carregados
 * @returns Objeto com a classe CSS da fonte
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadados da aplicação
 * 
 * Define informações importantes para:
 * - SEO (Search Engine Optimization)
 * - Compartilhamento em redes sociais
 * - Acessibilidade
 * - Performance
 * 
 * @property title - Título da aplicação
 * @property description - Descrição da aplicação
 */
export const metadata: Metadata = {
  title: "Lembretes",
  description: "Aplicação de gerenciamento de lembretes",
};

/**
 * Layout raiz da aplicação
 * 
 * Este componente:
 * 1. Define a estrutura HTML base
 * 2. Aplica a fonte Inter
 * 3. Inclui os estilos globais
 * 4. Envolve todas as páginas
 * 
 * @param children - Componentes filhos que serão renderizados
 * @returns JSX.Element - Estrutura HTML base da aplicação
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
