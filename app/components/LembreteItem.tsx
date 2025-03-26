/**
 * Componente que representa um lembrete individual
 * 
 * Este componente exibe um lembrete com suas informações
 * e permite interações como marcar como concluído,
 * editar e excluir.
 */

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lembrete {
  id: number;
  texto: string;
  data: string;
  prioridade: number;
  concluido: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LembreteItemProps {
  item: Lembrete;
  onDelete: (id: number) => void;
  onEdit: (item: Lembrete) => void;
  carregando: boolean;
  deletandoId: number | null;
}

/**
 * Componente de item de lembrete
 * 
 * @param item - Objeto contendo os dados do lembrete
 * @param onDelete - Função para deletar o lembrete
 * @param onEdit - Função para editar o lembrete
 * @param carregando - Estado de carregamento
 * @param deletandoId - ID do lembrete sendo deletado
 */
export default function LembreteItem({
  item,
  onDelete,
  onEdit,
  carregando,
  deletandoId
}: LembreteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.texto);

  // Formata a data para exibição no formato brasileiro
  const dataFormatada = format(new Date(item.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Função para salvar a edição
  const handleSaveEdit = () => {
    if (editText.trim() !== item.texto) {
      onEdit({ ...item, texto: editText });
    }
    setIsEditing(false);
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditText(item.texto);
    setIsEditing(false);
  };

  // Função para confirmar a deleção
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este lembrete?')) {
      try {
        await onDelete(item.id);
      } catch (error) {
        console.error('Erro ao deletar lembrete:', error);
        alert('Erro ao deletar o lembrete. Tente novamente.');
      }
    }
  };

  // Define as cores baseadas na prioridade
  const prioridadeCores = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start gap-4">
        {/* Checkbox de conclusão */}
        <button
          onClick={() => onToggleConcluido(item.id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
            ${item.concluido ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'}`}
        >
          {item.concluido && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Conteúdo do lembrete */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <p className={`text-lg font-medium ${item.concluido ? 'line-through text-gray-500' : ''}`}>
                  {item.texto}
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${prioridadeCores[item.prioridade as keyof typeof prioridadeCores]}`}>
                  {item.prioridade === 0 ? 'Baixa' : item.prioridade === 1 ? 'Média' : 'Alta'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">{dataFormatada}</p>
              </div>
            </>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 