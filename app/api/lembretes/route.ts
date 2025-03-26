import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para criar/atualizar lembretes
const LembreteSchema = z.object({
    texto: z.string().min(1, 'O texto é obrigatório').max(500, 'O texto deve ter no máximo 500 caracteres'),
    data: z.string(), // Aceita qualquer string como data
})

// Cache em memória para melhorar performance
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
        console.log('Iniciando busca de lembretes...')
        const lembretes = await prisma.lembrete.findMany({
            orderBy: {
                data: 'asc'
            }
        })
        console.log('Lembretes encontrados:', lembretes)
        return NextResponse.json(lembretes)
    } catch (error) {
        console.error('Erro detalhado ao buscar lembretes:', error)
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
        const body = await request.json()
        console.log('Dados recebidos:', body)

        // Valida apenas o texto, não valida a data
        const validatedData = LembreteSchema.parse(body)
        const { texto, data } = validatedData

        // Cria o lembrete no banco
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
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Erro ao criar lembrete' },
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
        console.log('Iniciando rota DELETE');
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        console.log('ID recebido:', id);

        // Validação do ID
        if (!id) {
            console.log('ID não fornecido');
            return NextResponse.json(
                { error: 'ID é obrigatório' },
                { status: 400 }
            )
        }

        // Validação do formato do ID
        const idNumero = Number(id);
        if (isNaN(idNumero)) {
            console.log('ID inválido:', id);
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            )
        }

        console.log('Buscando lembrete para deletar...');
        // Verifica se o lembrete existe antes de tentar deletar
        const lembreteExistente = await prisma.lembrete.findUnique({
            where: {
                id: idNumero
            }
        });

        if (!lembreteExistente) {
            console.log('Lembrete não encontrado com ID:', idNumero);
            return NextResponse.json(
                { error: 'Lembrete não encontrado' },
                { status: 404 }
            )
        }

        console.log('Lembrete encontrado:', lembreteExistente);
        console.log('Tentando deletar lembrete...');

        // delete é um método do Prisma que remove um registro
        const lembrete = await prisma.lembrete.delete({
            where: {
                id: idNumero
            }
        })

        console.log('Lembrete deletado com sucesso:', lembrete);
        return NextResponse.json({
            message: 'Lembrete deletado com sucesso',
            lembrete
        })
    } catch (error) {
        console.error('Erro detalhado ao deletar lembrete:', error)
        // Verifica se é um erro do Prisma
        if (error instanceof Error) {
            console.error('Mensagem de erro:', error.message);
            console.error('Stack trace:', error.stack);
        }
        return NextResponse.json(
            {
                error: 'Erro ao deletar lembrete',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            },
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