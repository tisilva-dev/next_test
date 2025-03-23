import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Configuração da fonte Inter do Google Fonts
 * 
 * A fonte é otimizada para carregamento:
 * - É carregada apenas quando necessário
 * - É pré-carregada para melhor performance
 * - Inclui apenas os pesos necessários
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadados da aplicação
 * 
 * Define informações importantes para SEO e
 * compartilhamento em redes sociais
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
