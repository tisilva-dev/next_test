import Image from "next/image";
import HomeClient from "./HomeClient";

/**
 * Página principal da aplicação
 * 
 * Este é um Server Component que serve como container
 * para o componente cliente HomeClient.
 * 
 * A separação entre Server e Client Components é uma
 * prática recomendada no Next.js 13+ para otimizar
 * a performance e a hidratação da aplicação.
 * 
 * O Server Component:
 * - É renderizado no servidor
 * - Não inclui JavaScript no bundle inicial
 * - Pode acessar recursos do servidor diretamente
 * 
 * O Client Component (HomeClient):
 * - É renderizado no navegador
 * - Inclui interatividade e estados
 * - Gerencia a comunicação com a API
 */
export default function Home() {
  return (
    <main>
      <HomeClient />
    </main>
  )
}