import { PrismaClient } from '@prisma/client'

/**
 * Declaração global para evitar múltiplas instâncias do PrismaClient
 * 
 * Em desenvolvimento, o Next.js pode recarregar os módulos frequentemente,
 * o que poderia criar múltiplas conexões com o banco de dados.
 * 
 * Esta declaração global garante que apenas uma instância do PrismaClient
 * seja criada e reutilizada durante todo o ciclo de vida da aplicação.
 */
declare global {
    var prisma: PrismaClient | undefined
}

/**
 * Cria uma única instância do PrismaClient
 * 
 * Se estiver em produção, usa a instância global se existir,
 * ou cria uma nova instância.
 * 
 * Em desenvolvimento, armazena a instância na variável global
 * para evitar múltiplas conexões durante o hot-reload.
 */
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
} 