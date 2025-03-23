import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const lembretes = await prisma.lembrete.findMany({
            orderBy: {
                data: 'asc'
            }
        })
        console.log('Lembretes encontrados:', lembretes)
        return NextResponse.json(lembretes)
    } catch (error) {
        console.error('Erro ao buscar lembretes:', error)
        return NextResponse.json({ error: 'Erro ao buscar lembretes' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { texto, data } = body

        console.log('Dados recebidos:', { texto, data })

        if (!texto || !data) {
            return NextResponse.json(
                { error: 'Texto e data são obrigatórios' },
                { status: 400 }
            )
        }

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