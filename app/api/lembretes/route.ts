import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Rota GET /api/lembretes
 * Retorna todos os lembretes ordenados por data
 * 
 * O Next.js 13+ usa o novo sistema de rotas baseado em App Router
 * Cada arquivo route.ts define os endpoints da API
 * 
 * O fluxo é:
 * 1. Busca todos os lembretes no banco
 * 2. Ordena por data em ordem crescente
 * 3. Retorna os dados em formato JSON
 * 
 * Em caso de erro:
 * - Retorna status 500
 * - Inclui mensagem de erro detalhada
 * 
 * @returns {Promise<NextResponse>} Resposta com a lista de lembretes ou erro
 */
export async function GET() {
    try {
        // findMany é um método do Prisma que retorna todos os registros
        // orderBy ordena os resultados pelo campo data em ordem ascendente
        const lembretes = await prisma.lembrete.findMany({
            orderBy: {
                data: 'asc'
            }
        })
        console.log('Lembretes encontrados:', lembretes)
        return NextResponse.json(lembretes)
    } catch (error) {
        console.error('Erro ao buscar lembretes:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar lembretes', details: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        )
    }
}

/**
 * Rota POST /api/lembretes
 * Cria um novo lembrete
 * 
 * O método POST é usado para criar novos recursos
 * O corpo da requisição deve conter texto e data
 * 
 * O fluxo é:
 * 1. Valida os campos obrigatórios
 * 2. Cria o lembrete no banco
 * 3. Retorna o lembrete criado
 * 
 * Em caso de erro:
 * - Retorna status 400 se faltar campos
 * - Retorna status 500 para outros erros
 * 
 * @param {Request} request - Objeto Request do Next.js contendo os dados do lembrete
 * @returns {Promise<NextResponse>} Resposta com o lembrete criado ou erro
 */
export async function POST(request: Request) {
    try {
        // request.json() converte o corpo da requisição em um objeto JavaScript
        const body = await request.json()
        const { texto, data } = body

        console.log('Dados recebidos:', { texto, data })

        // Validação dos campos obrigatórios
        if (!texto || !data) {
            return NextResponse.json(
                { error: 'Texto e data são obrigatórios' },
                { status: 400 }
            )
        }

        // create é um método do Prisma que insere um novo registro
        // new Date(data) converte a string ISO em um objeto Date
        const lembrete = await prisma.lembrete.create({
            data: {
                texto,
                data: new Date(data)
            }
        })

        console.log('Lembrete criado:', lembrete)
        return NextResponse.json(lembrete)
    } catch (error) {
        console.error('Erro ao criar lembrete:', error)
        return NextResponse.json(
            { error: 'Erro ao criar lembrete', details: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        )
    }
}

/**
 * Rota DELETE /api/lembretes?id={id}
 * Deleta um lembrete específico
 * 
 * O método DELETE é usado para remover recursos
 * O ID do lembrete é passado como parâmetro de query na URL
 * 
 * O fluxo é:
 * 1. Valida o ID fornecido
 * 2. Deleta o lembrete do banco
 * 3. Retorna o lembrete deletado
 * 
 * Em caso de erro:
 * - Retorna status 400 se faltar ID
 * - Retorna status 500 para outros erros
 * 
 * @param {Request} request - Objeto Request do Next.js contendo o ID do lembrete
 * @returns {Promise<NextResponse>} Resposta com confirmação da deleção ou erro
 */
export async function DELETE(request: Request) {
    try {
        // URL e searchParams são APIs do navegador para manipular URLs
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        // Validação do ID
        if (!id) {
            return NextResponse.json(
                { error: 'ID é obrigatório' },
                { status: 400 }
            )
        }

        // delete é um método do Prisma que remove um registro
        // where especifica qual registro deve ser deletado
        const lembrete = await prisma.lembrete.delete({
            where: {
                id: Number(id)
            }
        })

        return NextResponse.json(lembrete)
    } catch (error) {
        console.error('Erro ao deletar lembrete:', error)
        return NextResponse.json(
            { error: 'Erro ao deletar lembrete', details: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        )
    }
}

/**
 * Rota PUT /api/lembretes?id={id}
 * Atualiza um lembrete específico
 * 
 * O método PUT é usado para atualizar recursos existentes
 * O ID do lembrete é passado como parâmetro de query na URL
 * O corpo da requisição contém os novos dados
 * 
 * O fluxo é:
 * 1. Valida o ID e campos obrigatórios
 * 2. Atualiza o lembrete no banco
 * 3. Retorna o lembrete atualizado
 * 
 * Em caso de erro:
 * - Retorna status 400 se faltar ID ou campos
 * - Retorna status 500 para outros erros
 * 
 * @param {Request} request - Objeto Request do Next.js contendo o ID e os novos dados
 * @returns {Promise<NextResponse>} Resposta com o lembrete atualizado ou erro
 */
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        // Validação do ID
        if (!id) {
            return NextResponse.json(
                { error: 'ID é obrigatório' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { texto, data } = body

        // Validação dos campos obrigatórios
        if (!texto || !data) {
            return NextResponse.json(
                { error: 'Texto e data são obrigatórios' },
                { status: 400 }
            )
        }

        // update é um método do Prisma que atualiza um registro
        // where especifica qual registro deve ser atualizado
        // data contém os novos valores
        const lembrete = await prisma.lembrete.update({
            where: {
                id: Number(id)
            },
            data: {
                texto,
                data: new Date(data)
            }
        })

        return NextResponse.json(lembrete)
    } catch (error) {
        console.error('Erro ao atualizar lembrete:', error)
        return NextResponse.json(
            { error: 'Erro ao atualizar lembrete', details: error instanceof Error ? error.message : 'Erro desconhecido' },
            { status: 500 }
        )
    }
} 