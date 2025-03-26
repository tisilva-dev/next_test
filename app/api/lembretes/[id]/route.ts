/**
 * Rota para manipulação de lembretes por ID
 * 
 * Esta rota lida com operações específicas em um lembrete,
 * como atualização e deleção.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Deleta um lembrete específico
 * 
 * @param request - Requisição HTTP
 * @param params - Parâmetros da rota, incluindo o ID do lembrete
 * @returns Resposta HTTP com o resultado da operação
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Busca o lembrete para verificar se existe
    const lembrete = await prisma.lembrete.findUnique({
      where: { id }
    });

    if (!lembrete) {
      return NextResponse.json(
        { error: 'Lembrete não encontrado' },
        { status: 404 }
      );
    }

    // Deleta o lembrete
    await prisma.lembrete.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Lembrete deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar lembrete:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar o lembrete' },
      { status: 500 }
    );
  }
} 