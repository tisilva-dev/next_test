'use client'

import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from "next/image";
import SugestoesInput from './components/SugestoesInput';
import DatePicker from './components/DatePicker';

/**
 * Interface que define a estrutura de um lembrete
 * 
 * Em TypeScript, interfaces são usadas para definir a forma dos objetos
 * Isso ajuda na verificação de tipos e autocompletar do editor
 * 
 * Campos:
 * - id: número único gerado automaticamente pelo banco
 * - texto: conteúdo do lembrete
 * - data: data do lembrete no formato ISO (YYYY-MM-DD)
 * - createdAt: timestamp de criação do registro
 * - updatedAt: timestamp da última atualização
 */
interface Lembrete {
  id: number;          // ID único do lembrete
  texto: string;       // Texto do lembrete
  data: string;        // Data do lembrete no formato ISO
  createdAt: string;   // Data de criação do registro
  updatedAt: string;   // Data da última atualização
}

/**
 * Interface para respostas de erro da API
 * 
 * Usada para tipar as respostas de erro da API
 * O operador ? indica que o campo é opcional
 * 
 * Campos:
 * - error: mensagem principal do erro
 * - details: detalhes adicionais do erro (opcional)
 */
interface ApiResponse {
  error?: string;      // Mensagem de erro
  details?: string;    // Detalhes adicionais do erro
}

/**
 * Componente do formulário de criação de lembretes
 * 
 * Props:
 * - onSubmit: função chamada quando o formulário é submetido, recebe o texto e a data do lembrete
 * - carregando: estado booleano que indica se está salvando um lembrete
 * - erro: mensagem de erro a ser exibida, se houver
 * - lembretes: array com todos os lembretes
 * 
 * Funcionalidades:
 * - Validação de data em tempo real
 * - Formatação automática de data
 * - Feedback visual de erros
 * - Estado de carregamento durante o salvamento
 */
const LembreteForm = ({ onSubmit, carregando, erro, lembretes }: {
  onSubmit: (texto: string, data: string) => void;
  carregando: boolean;
  erro: string;
  lembretes: Lembrete[];
}) => {
  // Estados para controlar o formulário
  const [lembrete, setLembrete] = useState('');           // Texto do lembrete
  const [dataInput, setDataInput] = useState('');         // Data digitada

  // Função chamada ao clicar em salvar
  const handleSubmit = useCallback(() => {
    onSubmit(lembrete, dataInput);
    setLembrete('');
    setDataInput('');
  }, [lembrete, dataInput, onSubmit]);

  // Função para atualizar a data
  const handleDataChange = useCallback((value: string) => {
    setDataInput(value);
  }, []);

  // Renderização do formulário
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-8 h-8">
          <Image
            src="/images/add-icon.svg"
            alt="Adicionar"
            width={24}
            height={24}
            sizes="24px"
          />
        </div>
        <h2 className="text-2xl font-bold text-blue-700">Novo Lembrete</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <SugestoesInput
            value={lembrete}
            onChange={setLembrete}
            lembretes={lembretes}
            placeholder="Digite seu lembrete"
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image
              src="/images/note-icon.svg"
              alt="Nota"
              width={20}
              height={20}
              className="opacity-50"
            />
          </div>
        </div>
        <div className="relative">
          <DatePicker
            value={dataInput}
            onChange={handleDataChange}
            className="w-full md:w-48"
          />
        </div>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={handleSubmit}
          disabled={carregando || !lembrete || !dataInput}
        >
          {carregando ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Salvando...
            </>
          ) : (
            <>
              <Image
                src="/images/save-icon.svg"
                alt="Salvar"
                width={20}
                height={20}
                className="brightness-0 invert"
              />
              Salvar
            </>
          )}
        </button>
      </div>
      {erro && (
        <div className="flex items-center gap-2 mt-3 text-red-600">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-sm font-medium">{erro}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente que exibe um lembrete individual
 * 
 * Props:
 * - item: objeto contendo os dados do lembrete (id, texto, data, etc)
 * - onDelete: função chamada ao clicar no botão de deletar, recebe o ID do lembrete
 * - onEdit: função chamada ao clicar no botão de editar, recebe o objeto do lembrete
 * - carregando: estado booleano que indica se está carregando dados
 * - deletandoId: ID do lembrete que está sendo deletado atualmente
 * 
 * Funcionalidades:
 * - Exibe o texto e a data do lembrete
 * - Permite editar o lembrete
 * - Permite deletar o lembrete
 * - Mostra estado de carregamento durante a deleção
 * - Formata a data para exibição no formato brasileiro
 */
const LembreteItem = ({ item, onDelete, onEdit, carregando, deletandoId }: {
  item: Lembrete;
  onDelete: (id: number) => void;
  onEdit: (item: Lembrete) => void;
  carregando: boolean;
  deletandoId: number | null;
}) => {
  // Formata a data para exibição no formato brasileiro
  const dataFormatada = format(new Date(item.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Renderização do item
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 flex items-start gap-4">
          <div className="relative w-8 h-8 mt-1">
            <Image
              src="/images/reminder-icon.svg"
              alt="Lembrete"
              fill
              className="object-contain opacity-75"
            />
          </div>
          <div>
            <p className="text-lg font-medium text-blue-800">{item.texto}</p>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/images/calendar-icon.svg"
                alt="Data"
                width={16}
                height={16}
                className="opacity-50"
              />
              <p className="text-sm text-blue-600">{dataFormatada}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-warning flex items-center gap-2"
            onClick={() => onEdit(item)}
          >
            <Image
              src="/images/edit-icon.svg"
              alt="Editar"
              width={16}
              height={16}
              className="brightness-0 invert"
            />
            Editar
          </button>
          <button
            className="btn btn-danger flex items-center gap-2"
            onClick={() => onDelete(item.id)}
            disabled={deletandoId === item.id}
          >
            {deletandoId === item.id ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Deletando...
              </>
            ) : (
              <>
                <Image
                  src="/images/delete-icon.svg"
                  alt="Deletar"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
                Deletar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal da aplicação
 * 
 * Este componente implementa um CRUD completo de lembretes:
 * - Create: criação de novos lembretes
 * - Read: listagem de lembretes existentes
 * - Update: edição de lembretes
 * - Delete: remoção de lembretes
 * 
 * Estados:
 * - lembretes: array com todos os lembretes
 * - editandoId: ID do lembrete sendo editado
 * - lembreteEditando: texto do lembrete sendo editado
 * - dataEditando: data do lembrete sendo editado
 * - erro: mensagens de erro
 * - carregando: estado de carregamento
 * - deletandoId: ID do lembrete sendo deletado
 * 
 * Funcionalidades:
 * - Interface responsiva
 * - Animações suaves
 * - Estados de carregamento
 * - Confirmação de ações
 */
const HomeClient = () => {
  // Estados para gerenciar a lista de lembretes
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);  // Lista de lembretes

  // Estados para gerenciar a edição
  const [editandoId, setEditandoId] = useState<number | null>(null);  // ID do lembrete sendo editado
  const [lembreteEditando, setLembreteEditando] = useState('');       // Texto do lembrete sendo editado
  const [dataEditando, setDataEditando] = useState('');               // Data do lembrete sendo editado

  // Estados para gerenciar a interface
  const [erro, setErro] = useState('');                  // Mensagens de erro
  const [carregando, setCarregando] = useState(false);   // Estado de carregamento
  const [deletandoId, setDeletandoId] = useState<number | null>(null); // ID do lembrete sendo deletado

  /**
   * Função para buscar lembretes da API
   * 
   * Esta função:
   * 1. Define o estado de carregamento
   * 2. Faz a requisição GET
   * 3. Atualiza a lista de lembretes
   * 4. Trata erros possíveis
   */
  const buscarLembretes = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/lembretes');
      const data: Lembrete[] | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao buscar lembretes');
      }

      setLembretes(data as Lembrete[]);
      setErro('');
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      setErro('Erro ao carregar lembretes. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // Busca lembretes ao montar o componente
  useEffect(() => {
    buscarLembretes();
  }, [buscarLembretes]);

  /**
   * Função para salvar um novo lembrete
   * 
   * Esta função:
   * 1. Valida os campos
   * 2. Converte a data para ISO
   * 3. Faz a requisição POST
   * 4. Atualiza a lista após sucesso
   */
  const handleSubmit = useCallback(async (texto: string, dataString: string) => {
    if (!texto || !dataString) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, data: dataString }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao salvar lembrete');
      }

      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      setErro('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [buscarLembretes]);

  /**
   * Função para deletar um lembrete
   * 
   * Esta função:
   * 1. Marca o lembrete como sendo deletado
   * 2. Faz a requisição DELETE
   * 3. Atualiza a lista após sucesso
   * 
   * @param id - ID do lembrete a ser deletado
   */
  const handleDelete = async (id: number) => {
    try {
      setCarregando(true);
      setErro('');
      
      const response = await fetch(`/api/lembretes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar o lembrete');
      }

      // Atualiza a lista de lembretes removendo o item deletado
      setLembretes(prevLembretes => prevLembretes.filter(lembrete => lembrete.id !== id));
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      setErro('Erro ao deletar o lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Função para iniciar a edição de um lembrete
   * 
   * Esta função:
   * 1. Define qual lembrete está sendo editado através do ID
   * 2. Preenche o campo de texto com o conteúdo atual do lembrete
   * 3. Formata e preenche o campo de data com a data atual
   * 4. Marca a data como válida (já que é uma data existente)
   * 
   * @param item - Lembrete a ser editado
   */
  const iniciarEdicao = (item: Lembrete) => {
    setEditandoId(item.id);
    setLembreteEditando(item.texto);
    setDataEditando(item.data);
  };

  /**
   * Função para cancelar a edição de um lembrete
   * 
   * Esta função:
   * 1. Limpa o ID do lembrete sendo editado
   * 2. Limpa o texto do lembrete em edição
   * 3. Limpa a data do lembrete em edição
   * 4. Reseta o estado de validação da data
   * 5. Remove qualquer mensagem de erro
   */
  const cancelarEdicao = () => {
    setEditandoId(null);
    setLembreteEditando('');
    setDataEditando('');
    setErro('');
  };

  /**
   * Função para manipular mudanças no campo de texto durante a edição
   * 
   * Esta função:
   * 1. Atualiza o estado do texto do lembrete em edição
   * 2. Limpa mensagens de erro relacionadas ao texto
   * 
   * @param e - Evento de mudança do input
   */
  const handleLembreteEditandoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLembreteEditando(e.target.value);
    setErro('');
  };

  /**
   * Função para manipular mudanças no campo de data durante a edição
   * 
   * Similar ao handleDataChange, mas para o formulário de edição
   * Mantém a validação em tempo real da data
   */
  const handleDataEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataEditando(e.target.value);
  };

  /**
   * Função para salvar as alterações de um lembrete
   * 
   * Esta função:
   * 1. Valida os campos editados
   * 2. Converte a data para ISO
   * 3. Envia a requisição PUT
   * 4. Atualiza a lista após sucesso
   * 
   * @param id - ID do lembrete a ser atualizado
   */
  const salvarEdicao = async (id: number) => {
    if (!lembreteEditando || !dataEditando) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const [dia, mes, ano] = dataEditando.split('/').map(Number);
      const dataISO = new Date(ano, mes - 1, dia).toISOString().split('T')[0];

      const response = await fetch(`/api/lembretes?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: lembreteEditando,
          data: dataISO,
        }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao atualizar lembrete');
      }

      setEditandoId(null);
      setLembreteEditando('');
      setDataEditando('');
      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      setErro('Erro ao atualizar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Renderização do componente principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/reminder-icon.svg"
              alt="Ícone de Lembrete"
              fill
              className="object-contain animate-bounce"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Gerenciador de Lembretes
          </h1>
          <p className="text-blue-600 text-lg">
            Organize seus compromissos de forma simples e eficiente
          </p>
        </div>

        <div className="space-y-8">
          {/* Formulário de criação/edição de lembretes */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
            {editandoId ? (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-700">Editar Lembrete</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SugestoesInput
                      value={lembreteEditando}
                      onChange={setLembreteEditando}
                      lembretes={lembretes}
                      placeholder="Digite seu lembrete"
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <DatePicker
                      value={dataEditando}
                      onChange={setDataEditando}
                      className="w-full md:w-48"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary flex items-center gap-2"
                      onClick={() => salvarEdicao(editandoId)}
                      disabled={carregando || !lembreteEditando || !dataEditando}
                    >
                      {carregando ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Salvar
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary flex items-center gap-2"
                      onClick={cancelarEdicao}
                      disabled={carregando}
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </button>
                  </div>
                </div>
                {erro && (
                  <div className="flex items-center gap-2 mt-3 text-red-600">
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                      />
                    </svg>
                    <p className="text-sm font-medium">{erro}</p>
                  </div>
                )}
              </div>
            ) : (
              <LembreteForm
                onSubmit={handleSubmit}
                carregando={carregando}
                erro={erro}
                lembretes={lembretes}
              />
            )}
          </div>

          {/* Lista de lembretes */}
          <div className="space-y-4">
            {carregando && lembretes.length === 0 ? (
              // Estado de carregamento
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="text-blue-700 mt-6 text-lg font-medium">Carregando lembretes...</p>
              </div>
            ) : lembretes.length === 0 ? (
              // Lista vazia
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src="/images/empty-state.svg"
                    alt="Nenhum lembrete"
                    width={200}
                    height={200}
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
                <p className="text-blue-700 text-xl font-medium mb-2">Nenhum lembrete cadastrado</p>
                <p className="text-gray-600">Comece adicionando seu primeiro lembrete acima!</p>
              </div>
            ) : (
              // Lista de lembretes
              lembretes.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <LembreteItem
                    item={item}
                    onDelete={handleDelete}
                    onEdit={iniciarEdicao}
                    carregando={carregando}
                    deletandoId={deletandoId}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;